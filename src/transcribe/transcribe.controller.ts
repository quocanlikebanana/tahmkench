import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transcribe')
export class TranscribeController {
	constructor(
		private readonly transcribeService: TranscribeService
	) { }

	@Post()
	@UseGuards(AuthGuard)
	async transcribe(
		@Body() body: { audio: string; language: string; },
	): Promise<{
		transcript: string;
	}> {
		const transcript = await this.transcribeService.transcribeAudio(body.audio, body.language);
		return { transcript };
	}
}
