import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, transactionSchema } from './entities/transaction.entity';
import { AccountModule } from '../account/account.module';
import { Account, accountSchema } from '../account/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwtConfig';
import { LoggerModule } from '../logger/logger.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ MongooseModule.forFeature([
    { name: Transaction.name, schema: transactionSchema }
  ],
  ),
  MongooseModule.forFeature([{ name: Account.name, schema: accountSchema }]),
  AccountModule,
  JwtModule.registerAsync(jwtConfig),
  LoggerModule,
  UserModule
],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
