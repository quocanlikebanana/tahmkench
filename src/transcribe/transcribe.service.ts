import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssemblyAI } from 'assemblyai';

const languageMapping: Record<string, string> = {
	English: 'en',
	Vietnamese: 'vi',
};

@Injectable()
export class TranscribeService {
	private assemblyAI: AssemblyAI;

	constructor(
		private readonly configService: ConfigService
	) {
		const apiKey = this.configService.get("ASSEMBLYAI_API_KEY");
		this.assemblyAI = new AssemblyAI({
			apiKey,
		});
	}

	dataURLtoBlob(dataurl: string): Blob {
		const arr = dataurl.split(',');
		if (arr.length !== 2) {
			throw new Error('Invalid data URL format');
		}
		const mime = arr[0].match(/:(.*?);/)![1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new Blob([u8arr], { type: mime });
	}

	async transcribeAudio(
		audio: string,
		language: string = 'English',
	): Promise<string> {
		if (audio == null) {
			throw new BadRequestException('No audio data provided');
		}
		try {
			const blob = this.dataURLtoBlob(audio);
			const languageCode = languageMapping[language] || 'en';
			const transcription = await this.assemblyAI.transcripts.transcribe({
				audio: blob,
				language_code: languageCode,
			});
			return transcription.text || '';
		} catch (error) {
			throw new InternalServerErrorException(`Transcription failed: ${error.message}`);
		}
	}
}
