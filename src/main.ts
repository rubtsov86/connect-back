import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:4200',
      process.env.FRONTEND_URL_CORS
        ? process.env.FRONTEND_URL_CORS
        : 'http://localhost:3002',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Employment Connect API')
    .setDescription('Open Api schema for ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
