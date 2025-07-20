import { z } from "zod";

export const geminiResponseSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	difficulty: z.enum(['Intern', 'Junior', 'Middle', 'Senior', 'Lead', 'Expert']).optional().default('Intern'),
	tags: z.array(z.string()).optional(),
	outlines: z.array(z.string()).optional(),
});

export type GeminiResponseType = z.infer<typeof geminiResponseSchema>;
