import { Controller, Get, Query } from '@nestjs/common';
import { GeminiService } from './gemini/gemini.service';
import { GeminiResponseType } from './gemini/types';

@Controller('suggestion')
export class SuggestionController {
	constructor(
		private readonly geminiService: GeminiService,
	) { }

	@Get('title')
	async getTitleSuggestion(@Query('recentTestTitles') recentTestTitles: string[]): Promise<string | undefined> {
		return this.geminiService.nextTestTitleSuggestion(recentTestTitles);
	}

	@Get('tags')
	async getTagsSuggestion(
		@Query('testTitle') testTitle: string,
		@Query('existingTags') existingTags: string[],
	): Promise<string[] | undefined> {
		return this.geminiService.tagsSuggestion(testTitle, existingTags);
	}

	@Get('pdf-job-description')
	async getPdfJobDescriptionExtract(@Query('file') file: Blob): Promise<GeminiResponseType | undefined> {
		return this.geminiService.pdfJobDescriptionExtract(file);
	}

	@Get('image-job-description')
	async getImageJobDescriptionExtract(@Query('file') file: Blob): Promise<GeminiResponseType | undefined> {
		return this.geminiService.imageJobDescriptionExtract(file);
	}

	@Get('text-job-description')
	async getTextJobDescriptionExtract(@Query('text') text: string): Promise<GeminiResponseType | undefined> {
		return this.geminiService.textJobDescriptionExtract(text);
	}
}
