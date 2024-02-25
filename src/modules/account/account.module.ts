import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from './entities/account.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwtConfig';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: accountSchema },
    ]),
    UserModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AccountController],
  providers: [AccountService, Account],
  exports: [AccountService, Account]
})
export class AccountModule {}
