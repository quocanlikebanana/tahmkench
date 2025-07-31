import { IsString } from "class-validator";

export class PostTranscribeBody {
	@IsString()
	audio: string;

	@IsString()
	language: string;
}

