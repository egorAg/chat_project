import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = 5001;

  const logger: Logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT).then(() => {
    logger.log(`Server started on port: ${PORT}`, NestApplication.name);
  });
}

bootstrap().then();
