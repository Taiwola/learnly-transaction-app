import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => ({
    global: true,
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  }),
};