import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule, 
    AuthModule, AccountModule, TransactionsModule, LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
