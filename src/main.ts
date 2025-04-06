import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля не описанные в DTO
      forbidNonWhitelisted: true, // выбрасывает ошибку при наличии лишних полей
      transform: true, // автоматическое преобразование типов
    }),
  );

  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('Product Management API')
    .setDescription('API для управления товарными позициями')
    .setVersion('1.0')
    .addTag('products', 'Операции с товарами')
    .addBearerAuth() // Если будете добавлять авторизацию
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Сохранение авторизации при обновлении
      tagsSorter: 'alpha', // Сортировка тегов по алфавиту
      operationsSorter: 'alpha', // Сортировка операций по алфавиту
    },
  });

  // Включение CORS для фронтенда
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
