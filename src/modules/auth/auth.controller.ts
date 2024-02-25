import { Controller, Get, Post, Body, Res, HttpCode, HttpStatus, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import {Response} from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(loginDto, res);
  }
}


