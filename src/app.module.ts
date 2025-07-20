import { Module } from '@nestjs/common';
import { TranscribeModule } from './transcribe/transcribe.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './configs/env.validation';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { SuggestionModule } from './suggestion/suggestion.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => {
				const parsedEnv = envSchema.safeParse(config);
				if (!parsedEnv.success) {
					console.error(parsedEnv.error.message);
					process.exit(1);
				}
				return parsedEnv.data;
			},
		}),
		HttpModule.register({
			global: true,
		}),

		// Services modules
		TranscribeModule,
		AuthModule,
		SuggestionModule,
	],
})
export class AppModule { }
