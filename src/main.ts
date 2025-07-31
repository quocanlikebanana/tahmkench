import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './configs/http-exception.filter';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('TahmKench API')
		.setDescription('API for TahmKench project')
		.setVersion('1.0')
		.addTag('Transcribe')
		.addTag('Suggestion')
		.addTag('Auth')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory());

	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: "*",
	});
	app.use(json({ limit: '10mb' }));
	app.use(urlencoded({ limit: '10mb', extended: true }));

	app.useGlobalFilters(new AllExceptionsFilter());
	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
