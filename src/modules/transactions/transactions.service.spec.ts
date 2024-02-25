import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, FilterDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument, TransactionType } from './entities/transaction.entity';
import { Account, AccountDocument } from '../account/entities/account.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<TransactionDocument>;
  let accountModel: Model<AccountDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(Transaction.name), useValue: Model },
        { provide: getModelToken(Account.name), useValue: Model },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionModel = module.get<Model<TransactionDocument>>(getModelToken(Transaction.name));
    accountModel = module.get<Model<AccountDocument>>(getModelToken(Account.name));
  });

  describe('createDeposit', () => {
    it('should create a deposit and update the account balance', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: createTransactionDto.transaction_pin,
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);
      accountModel.findByIdAndUpdate = jest.fn();
      transactionModel.create = jest.fn();

      const result = await service.createDeposit(createTransactionDto);

      expect(accountModel.findById).toHaveBeenCalledWith(createTransactionDto.sourceAccount);
      expect(accountModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createTransactionDto.sourceAccount,
        { $inc: { balance: createTransactionDto.amount } },
        { new: true },
      );
      expect(transactionModel.create).toHaveBeenCalledWith({
        type: TransactionType.deposit,
        sourceAccount: account._id,
        amount: createTransactionDto.amount,
      });
      expect(result).toBeInstanceOf(Transaction);
    });

    it('should throw an error if the source account is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      accountModel.findById = jest.fn().mockResolvedValue(null);

      try {
        await service.createDeposit(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Source account not found');
      }
    });

    it('should throw an error if the transaction pin is invalid', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: '5678',
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);

      try {
        await service.createDeposit(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe('Invalid pin');
      }
    });

    it('should throw an error if the deposit amount is invalid', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 0,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: createTransactionDto.transaction_pin,
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);

      try {
        await service.createDeposit(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('Invalid deposit amount');
      }
    });
  });

  describe('createWithdrawal', () => {
    it('should create a withdrawal and update the account balance', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: createTransactionDto.transaction_pin,
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);
      accountModel.findByIdAndUpdate = jest.fn();
      transactionModel.create = jest.fn();

      const result = await service.createWithdrawal(createTransactionDto);

      expect(accountModel.findById).toHaveBeenCalledWith(createTransactionDto.sourceAccount);
      expect(accountModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createTransactionDto.sourceAccount,
        { $inc: { balance: -createTransactionDto.amount } },
        { new: true },
      );
      expect(transactionModel.create).toHaveBeenCalledWith({
        sourceAccount: account._id,
        type: TransactionType.withdrawal,
        amount: createTransactionDto.amount,
      });
      expect(result).toBeInstanceOf(Transaction);
    });

    it('should throw an error if the source account is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      accountModel.findById = jest.fn().mockResolvedValue(null);

      try {
        await service.createWithdrawal(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Source account not found');
      }
    });

    it('should throw an error if the transaction pin is invalid', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: '5678',
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);

      try {
        await service.createWithdrawal(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe('Invalid pin');
      }
    });

    it('should throw an error if the withdrawal amount is above the account balance', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        transaction_pin: 1234,
        amount: 600,
      };
      const account = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: createTransactionDto.transaction_pin,
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(account);

      try {
        await service.createWithdrawal(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe("Amount above account balance");
      }
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds and update the account balances', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        destinationAccount: 'destinationAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const fromAccount = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: createTransactionDto.transaction_pin,
        balance: 500,
      };
      const toAccount = {
        _id: createTransactionDto.destinationAccount,
        balance: 200,
      };
      accountModel.findById = jest.fn().mockResolvedValue(fromAccount).mockResolvedValueOnce(toAccount);
      accountModel.findByIdAndUpdate = jest.fn();
      transactionModel.create = jest.fn();

      const result = await service.transferFunds(createTransactionDto);

      expect(accountModel.findById).toHaveBeenCalledWith(createTransactionDto.sourceAccount);
      expect(accountModel.findById).toHaveBeenCalledWith(createTransactionDto.destinationAccount);
      expect(accountModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createTransactionDto.sourceAccount,
        { $inc: { balance: -createTransactionDto.amount } },
        { new: true },
      );
      expect(accountModel.findByIdAndUpdate).toHaveBeenCalledWith(
        createTransactionDto.destinationAccount,
        { $inc: { balance: createTransactionDto.amount } },
        { new: true },
      );
      expect(transactionModel.create).toHaveBeenCalledWith({
        sourceAccount: fromAccount._id,
        destinationAccount: toAccount._id,
        amount: createTransactionDto.amount,
        type: TransactionType.transfer,
      });
      expect(result).toBeInstanceOf(Transaction);
    });

    it('should throw an error if one or both accounts do not exist', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        destinationAccount: 'destinationAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      accountModel.findById = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      try {
        await service.transferFunds(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("One or both accounts do not exist.");
      }
    });

    it('should throw an error if the transaction pin is invalid', async () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: 'sourceAccountId',
        destinationAccount: 'destinationAccountId',
        transaction_pin: 1234,
        amount: 100,
      };
      const fromAccount = {
        _id: createTransactionDto.sourceAccount,
        transaction_pin: '5678',
        balance: 500,
      };
      accountModel.findById = jest.fn().mockResolvedValue(fromAccount);

      try {
        await service.transferFunds(createTransactionDto);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.message).toBe('Invalid pin');
    }
  });
});
})