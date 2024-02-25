import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { JwtPayLoad } from './modules/auth/interface/auth.interface';


declare global {
  namespace Express {
    interface Request {
      user: JwtPayLoad
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });
  app.use(compression());
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );


  await app.listen(3000);
}
bootstrap();

