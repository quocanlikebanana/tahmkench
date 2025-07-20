import { GoogleGenAI, Type } from "@google/genai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "src/configs/env.validation";
import { BadRequestError } from "src/errors/bad-request.error";
import { geminiResponseSchema, GeminiResponseType } from "./types";

@Injectable()
export class GeminiService {
	private readonly genAI: GoogleGenAI;
	private readonly responseSchema = {
		type: Type.OBJECT,
		required: ["title", "difficulty"],
		properties: {
			title: {
				type: Type.STRING,
			},
			description: {
				type: Type.STRING
			},
			difficulty: {
				type: Type.STRING,
				enum: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead', 'Expert'],
			},
			tags: {
				type: Type.ARRAY,
				items: {
					type: Type.STRING
				}
			},
			outlines: {
				type: Type.ARRAY,
				items: {
					type: Type.STRING
				}
			}
		},
	};

	constructor(
		private readonly configService: ConfigService<EnvConfig>,
	) {
		this.genAI = new GoogleGenAI({
			apiKey: this.configService.get<string>('GEMINI_API_KEY'),
		});
	}

	async nextTestTitleSuggestion(recentTestTitles: string[]): Promise<string | undefined> {
		const prompt = `
		User has generated the following test titles: ${recentTestTitles.join(", ")}. Now suggest the next test title that suitable for their practice. Return only the title without any additional text or explanation.
		`;
		const response = await this.genAI.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
			config: {
			}
		});
		return response.text;
	}

	async tagsSuggestion(testTitle: string, existingTags: string[]): Promise<string[] | undefined> {
		const prompt = `
		User has generated the following test title: "${testTitle}". Suggest from 3 - 5 tags that are relevant to this title. The user has already used the following tags: ${existingTags.join(", ")}. Return only the suggested tags without any additional text or explanation.
		`;
		const response = await this.genAI.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.ARRAY,
					items: {
						type: Type.STRING,
					},
				}
			}
		});

		if (response.text) {
			try {
				const tags = JSON.parse(response.text);
				if (Array.isArray(tags)) {
					return tags;
				} else {
					console.error("Parsed response is not an array:", tags);
				}
			} catch (error) {
				console.error("Error parsing response text:", error);
			}
		} else {
			console.warn("No text returned from Gemini API");
		}
	}

	async pdfJobDescriptionExtract(file: Blob): Promise<GeminiResponseType | undefined> {
		if (file.size > 10 * 1024 * 1024) { // 10 MB limit
			throw new BadRequestError("File size exceeds the 10 MB limit.");
		}
		if (file.type !== "application/pdf") {
			throw new BadRequestError("File type is not supported. Only PDF files are allowed.");
		}

		const arrayBuffer = await file.arrayBuffer();

		const prompt = `
		User has uploaded a PDF file that describes a Job Description. Your goal is to understand the content of the PDF file and extract the nessessary information to create a practice test. The extracted information should be structured as follows:
			1. title: The title of the practice that should be used for the job.
			2. description: Summarize the content of the PDF file in a few sentences.
			3. difficulty: The experience level required for the job.
			4. tags: An array of tags that are relevant to the job position. There should be at least 3 tags and no more than 20 tags.
			5. outlines: An array of strings that represent the main topics or skills covered in the job description. There should be at least 3 outlines and no more than 20 outlines.

		Please return the extracted information in JSON format without any additional text or explanation and the JSON content language in string fields should be the same language that used in the PDF.
		`;
		const response = await this.genAI.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					text: prompt
				},
				{
					inlineData: {
						mimeType: "application/pdf",
						data: Buffer.from(arrayBuffer).toString("base64"),
					}
				}
			],
			config: {
				responseMimeType: "application/json",
				responseSchema: this.responseSchema,
			}
		});
		if (response.text) {
			try {
				const parsedResponse = JSON.parse(response.text);
				const validationResult = geminiResponseSchema.safeParse(parsedResponse);
				if (validationResult.success) {
					return validationResult.data;
				} else {
					console.error("Validation failed:", validationResult.error);
					throw new BadRequestError("Invalid response format from Gemini API.");
				}
			} catch (error) {
				console.error("Error parsing response text:", error);
				throw new BadRequestError("Failed to parse response from Gemini API.");
			}
		} else {
			throw new BadRequestError("No text returned from Gemini API.");
		}
	}

	async imageJobDescriptionExtract(file: Blob): Promise<GeminiResponseType | undefined> {
		if (file.size > 10 * 1024 * 1024) { // 10 MB limit
			throw new BadRequestError("File size exceeds the 10 MB limit.");
		}
		if (!file.type.startsWith("image/")) {
			throw new BadRequestError("File type is not supported. Only image files are allowed.");
		}
		const arrayBuffer = await file.arrayBuffer();
		const prompt = `
		User has uploaded an image file that describes a Job Description. Your goal is to understand the content of the image file and extract the necessary information to create a practice test. The extracted information should be structured as follows:
			1. title: The title of the practice that should be used for the job.
			2. description: Summarize the content of the image file in a few sentences.
			3. difficulty: The experience level required for the job.
			4. tags: An array of tags that are relevant to the job position. There should be at least 3 tags and no more than 20 tags.
			5. outlines: An array of strings that represent the main topics or skills covered in the job description. There should be at least 3 outlines and no more than 20 outlines.

		Please return the extracted information in JSON format without any additional text or explanation and the JSON content language in string fields should be the same language that used in the image.
		`;
		const response = await this.genAI.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					text: prompt
				},
				{
					inlineData: {
						mimeType: file.type,
						data: Buffer.from(arrayBuffer).toString("base64"),
					}
				}
			],
			config: {
				responseMimeType: "application/json",
				responseSchema: this.responseSchema
			}
		});
		if (response.text) {
			try {
				const parsedResponse = JSON.parse(response.text);
				const validationResult = geminiResponseSchema.safeParse(parsedResponse);
				if (validationResult.success) {
					return validationResult.data;
				} else {
					console.error("Validation failed:", validationResult.error);
					throw new BadRequestError("Invalid response format from Gemini API.");
				}
			} catch (error) {
				console.error("Error parsing response text:", error);
				throw new BadRequestError("Failed to parse response from Gemini API.");
			}
		} else {
			throw new BadRequestError("No text returned from Gemini API.");
		}
	}

	async textJobDescriptionExtract(text: string): Promise<GeminiResponseType | undefined> {
		const prompt = `
		User has provided a text snippet: ${text}
		. It describes a Job Description. Your goal is to understand the content of the text and extract the necessary information to create a practice test. The extracted information should be structured as follows:
			1. title: The title of the practice that should be used for the job.
			2. description: Summarize the content of the text in a few sentences.
			3. difficulty: The experience level required for the job.
			4. tags: An array of tags that are relevant to the job position. There should be at least 3 tags and no more than 20 tags.
			5. outlines: An array of strings that represent the main topics or skills covered in the job description. There should be at least 3 outlines and no more than 20 outlines.

		Please return the extracted information in JSON format without any additional text or explanation and the JSON content language in string fields should be the same language that used in the text.
		`;
		const response = await this.genAI.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					text: prompt
				},
			],
			config: {
				responseMimeType: "application/json",
				responseSchema: this.responseSchema,
			}
		});

		if (response.text) {
			try {
				const parsedResponse = JSON.parse(response.text);
				const validationResult = geminiResponseSchema.safeParse(parsedResponse);
				if (validationResult.success) {
					return validationResult.data;
				} else {
					console.error("Validation failed:", validationResult.error);
					throw new BadRequestError("Invalid response format from Gemini API.");
				}
			} catch (error) {
				console.error("Error parsing response text:", error);
				throw new BadRequestError("Failed to parse response from Gemini API.");
			}
		} else {
			throw new BadRequestError("No text returned from Gemini API.");
		}
	}
}
