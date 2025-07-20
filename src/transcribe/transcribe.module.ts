import { Module } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { TranscribeController } from './transcribe.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [AuthModule],
	providers: [TranscribeService],
	controllers: [TranscribeController],
})
export class TranscribeModule { }
