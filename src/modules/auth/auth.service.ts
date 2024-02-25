import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './interface/auth.interface';
import { CreateUserResponse } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

    // private methods or utility functions
    private async generateToken(email: string, id: string) {
      const payload = { id, email };
      const token = await this.jwtService.signAsync(payload);
      return token;
    }

    private async verifyToken(token: string) {
      try {
        const decodedPayload = (await this.jwtService.verifyAsync(
          token,
        )) as JwtPayLoad;
        const userId = decodedPayload.id;
        return userId;
      } catch (error) {
        console.log(error);
        return null;
      }
    }


    // Route functions

  async create(createAuthDto: CreateAuthDto) {
    return await this.userService.createUser(createAuthDto);
  }

  async signin(loginDto: LoginDto, res: Response) {
    const {email, password} = loginDto;
    const user = await this.userService.getUser(email);

    if (!user) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }

    const comparePwd = await bcrypt.compare(password, user.password);

    if(!comparePwd){
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

      // Calculate the expiration time, which is the current time plus one day
      const expirationDate = new Date(Date.now() + oneDay);
      const token = await this.generateToken(user.email, user._id.toString());
      res.cookie("Token", token, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      });

      const result = new CreateUserResponse(user);
      
      res.status(200).json({
        result,
        accessToken: token
      })
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
