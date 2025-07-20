import { Module } from '@nestjs/common';
import { SuggestionController } from './suggestion.controller';
import { GeminiService } from './gemini/gemini.service';

@Module({
	providers: [GeminiService],
	controllers: [SuggestionController]
})
export class SuggestionModule { }
