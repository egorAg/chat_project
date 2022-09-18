import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = 5001;

  const logger: Logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    origin: true,
    credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT).then(() => {
    logger.log(`Server started on port: ${PORT}`, NestApplication.name);
  });
}

bootstrap().then();
