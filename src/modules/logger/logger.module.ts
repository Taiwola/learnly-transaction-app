import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { HttpLoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService]
})

export class LoggerModule implements NestModule {
  constructor(private readonly logger: LoggerService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
