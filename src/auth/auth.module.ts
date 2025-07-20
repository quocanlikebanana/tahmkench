import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [AuthGuard],
	exports: [AuthGuard],
})
export class AuthModule { }
