import {
    Injectable,
    ExecutionContext,
    CanActivate,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import {JwtPayLoad} from "../interface/auth.interface";
import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly reflector: Reflector
        ) {}
  
    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
          );
      
          if (isPublic) {
            return true;
          }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        return false;
      }

      try {
        const verifyToken = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        if (!verifyToken) {
          throw new HttpException(
            'Invalid token or token has expired',
            HttpStatus.BAD_GATEWAY,
          );
        }
        const payload = this.jwtService.decode(token) as JwtPayLoad;
        request.user = payload;
        return true;
      } catch (error) {
        console.log('Auth Guard Error: ', error);
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    private extractTokenFromHeader(request: Request) {
      const [type, token] = request.headers?.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : false;
    }
  }
  