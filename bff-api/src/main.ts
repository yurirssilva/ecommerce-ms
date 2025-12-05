import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,            // remove campos extras
            forbidNonWhitelisted: true, // lança erro se enviar campos inválidos
            transform: true,            // converte tipos automaticamente
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Ecommerce BFF API')
        .setDescription('Documentação da API do BFF do ecommerce')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
}
bootstrap();