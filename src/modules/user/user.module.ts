import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwtConfig';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
    ]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [UserController],
  providers: [UserService, User
  ],
  exports: [UserService, User]
})
export class UserModule {}
