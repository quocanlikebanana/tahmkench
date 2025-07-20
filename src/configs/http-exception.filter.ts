import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';
		let extra: any;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const res = exception.getResponse();
			message = typeof res === 'string' ? res : (res as any).message || message;
		} else if (exception instanceof BadRequestException) {
			status = HttpStatus.BAD_REQUEST;
			message = exception.message;
			extra = exception.getResponse();
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		response.status(status).json({
			message: message,
			statusCode: status,
			timestamp: new Date().toISOString(),
			extra: extra || null,
		});
	}
}
