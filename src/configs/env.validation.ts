import { z } from 'zod';

export const envSchema = z.object({
	ASSEMBLYAI_API_KEY: z.string().min(1, 'ASSEMBLYAI_API_KEY is required'),
	GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

	MAIN_BACKEND_URL: z.string().min(1, 'MAIN_BACKEND_URL is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;


