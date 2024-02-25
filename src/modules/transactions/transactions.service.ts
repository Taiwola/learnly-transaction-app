import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto, FilterDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument, TransactionType } from './entities/transaction.entity';
import { Model } from 'mongoose';
import { Account } from '../account/entities/account.entity';
import { LoggerService } from '../logger/logger.service';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    private readonly logger: LoggerService,
  ) {}

  async createDeposit(createTransactionDto: CreateTransactionDto) {
    const session = await this.transactionModel.db.startSession();
    session.startTransaction();
    try {
      const account = await this.accountModel.findById(createTransactionDto.sourceAccount).session(session);
      if (!account) {
        return new HttpException('Source account not found', HttpStatus.NOT_FOUND);
      }

      if (createTransactionDto.transaction_pin !== account.transaction_pin) {
        return new HttpException('Invalid pin', HttpStatus.FORBIDDEN);
      }

      if (createTransactionDto.amount <= 0) {
        return new HttpException('Invalid deposit amount', HttpStatus.BAD_REQUEST);
      }

      account.balance += createTransactionDto.amount;
      await account.save({session});

      const transaction = new this.transactionModel({
        type: TransactionType.deposit,
        sourceAccount: account._id,
        amount: createTransactionDto.amount
      });

      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();
      this.logger.logDeposit(account.account_no.toString(), createTransactionDto.amount)
      return transaction;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      this.logger.error(`Error: ${error}`);
      return new HttpException('Error creating deposit', HttpStatus.BAD_REQUEST);
    }
  }

  async createWithdrawal(createTransactionDto: CreateTransactionDto) {
    const session = await this.transactionModel.db.startSession();
    session.startTransaction();
    try {
      const account = await this.accountModel.findById(createTransactionDto.sourceAccount).session(session);
      if (!account) {
        return new HttpException('Source account not found', HttpStatus.NOT_FOUND);
      }

      if (createTransactionDto.transaction_pin !== account.transaction_pin) {
        return new HttpException('Invalid pin', HttpStatus.FORBIDDEN);
      }

      if (createTransactionDto.amount > account.balance) {
        this.logger.error(`Amount above account balance for ${account.account_no}`);
        return new HttpException("Amount above account balance", HttpStatus.BAD_REQUEST);
      };
      
      account.balance -= createTransactionDto.amount;
      await account.save({session});

      const transaction = new this.transactionModel({
        sourceAccount: createTransactionDto.sourceAccount,
        type: TransactionType.withdrawal,
        amount: createTransactionDto.amount
      });

      await transaction.save({session});

      await session.commitTransaction();
      session.endSession();
      this.logger.logWithdrawal(account.account_no.toString(), createTransactionDto.amount);
      return transaction;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      this.logger.error(`Error: ${error}`);
      return new HttpException('Error in making withdrawal', HttpStatus.BAD_REQUEST);
    }
  }

  async transferFunds(createTransactionDto: CreateTransactionDto) {
    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
    const {sourceAccount, destinationAccount, amount} = createTransactionDto;
    const fromAccount = await this.accountModel.findById(sourceAccount).session(session);
    const toAccount = await this.accountModel.findById(destinationAccount).session(session);

    if (!fromAccount || !toAccount) {
      return new HttpException("One or both accounts do not exist.", HttpStatus.NOT_FOUND);
    }

    if (createTransactionDto.transaction_pin !== fromAccount.transaction_pin) {
      return new HttpException('Invalid pin', HttpStatus.FORBIDDEN);
    }

    if (amount > fromAccount.balance) {
      this.logger.error(`Insufficient funds for account number ${fromAccount.account_no}.`);
      return new HttpException("Insufficient funds", HttpStatus.CONFLICT);
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    const transaction = new this.transactionModel({
      sourceAccount:  fromAccount._id,
      destinationAccount: toAccount._id,
      amount,
      type: TransactionType.transfer
    });

      await transaction.save({session});

      await session.commitTransaction();
      session.endSession();
      this.logger.logTransfer(fromAccount.account_no, toAccount.account_no, amount);
      return transaction;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      this.logger.error(`Error: ${error}`);
      return  new HttpException('Server error while processing the request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const transactions = await this.transactionModel.find();
    return transactions;
  }

  async findOne(id: string) {
    const transaction = (await (await this.transactionModel.findById(id)).populate('sourceAccount')).populate('destinationAccount');
    return transaction;
  }

  async findAccountTransaction (filterDto: FilterDto) {
    const {sourceAccount, destinationAccount, startDate, endDate} = filterDto;

    if (!sourceAccount && !destinationAccount) {
      return new Error('Either sourceAccount or destinationAccount must be provided.');
  }

  let filter: any = {};
    if (sourceAccount) {
        filter = { ...filter, sourceAccount };
    }
    if (destinationAccount) {
        filter = { ...filter, destinationAccount };
    }
    if (startDate && endDate) {
        filter = { ...filter, createdAt: { $gte: startDate, $lte: endDate } };
    } else if (startDate) {
        filter = { ...filter, createdAt: { $gte: startDate } };
    } else if (endDate) {
        filter = { ...filter, createdAt: { $lte: endDate } };
    }

    const transactions = await this.transactionModel.find({...filter});

    return transactions;
  }
}
