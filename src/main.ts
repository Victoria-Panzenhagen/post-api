import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('EducaBlog API')
    .setDescription('API para gerenciamento de blog educacional')
    .setVersion('1.0')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades não definidas no DTO
      transform: true, // Transforma payloads para instâncias de DTO
    }),
  );

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'EducaBlog API',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
