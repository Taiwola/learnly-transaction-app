import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../modules/logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, ip } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.info(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });

    next();
  }
}
