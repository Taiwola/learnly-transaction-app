import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Test } from '@nestjs/testing';

// Mock the TransactionsService
jest.mock('./transactions.service');

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        { provide: AuthGuard, useValue: {} }, // Mock the AuthGuard
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('create', () => {
    it('should call the createDeposit method on the service', () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: '65d6f1cea79b5ed2a583fc9c',
        amount: 2000,
        transaction_pin: 1000
      };
      controller.create(createTransactionDto);
      expect(service.createDeposit).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should call the createWithdrawal method on the service', () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: '65d6f1cea79b5ed2a583fc9c',
        amount: 2000,
        transaction_pin: 1000
      };
      controller.withdraw(createTransactionDto);
      expect(service.createWithdrawal).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should call the transferFunds method on the service', () => {
      const createTransactionDto: CreateTransactionDto = {
        sourceAccount: '',
        amount: 0,
        transaction_pin: 0
      };
      controller.transfer(createTransactionDto);
      expect(service.transferFunds).toHaveBeenCalledWith(createTransactionDto);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method on the service', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('filterTransactions', () => {
    it('should call the findAccountTransaction method on the service with the correct filter', () => {
      const sourceAccount = 'source';
      const destinationAccount = 'destination';
      const startDate = new Date();
      const endDate = new Date();
      const filter = { sourceAccount, destinationAccount, startDate, endDate };
      controller.filterTransactions(sourceAccount, destinationAccount, startDate, endDate);
      expect(service.findAccountTransaction).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method on the service with the correct id', () => {
      const id = '65d6f1cea79b5ed2a583fc9c';
      controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});