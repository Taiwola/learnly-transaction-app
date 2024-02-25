import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRoles } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayLoad } from '../interface/auth.interface';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
        private userService: UserService,
        public reflector: Reflector,
        private jwtService: JwtService,
      ) {}

  async canActivate(
    context: ExecutionContext,
  ) {
    const role = this.reflector.get<UserRoles[]>('roles', context.getHandler());
    if (role && role.length > 0 ) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException('invalid token', HttpStatus.FORBIDDEN);
          }

          const payload = this.jwtService.decode(token) as JwtPayLoad;
          const user = await this.userService.getUserById(payload.id);
          if (!user) {
            throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
          }
         if (role.includes(user.roles)) {
            return true
         } else {
            return false
         }
    } else {
        return false
    }
  }


  private extractTokenFromHeader(request: Request) {
    const token = request?.headers?.authorization?.split(' ')[1];
    return token;
  }
}


