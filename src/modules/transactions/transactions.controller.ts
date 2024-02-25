import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';


@UseGuards(AuthGuard) // Protect routes with JWT authentication guard
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Post('deposit')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    ) {
    return this.transactionsService.createDeposit(createTransactionDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Post('withdraw')
  withdraw(@Body() CreateTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createWithdrawal(CreateTransactionDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Post('transfer')
  transfer(@Body() CreateTransactionDto: CreateTransactionDto) {
    return this.transactionsService.transferFunds(CreateTransactionDto)
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get('account')
  filterTransactions(
    @Query('sourceAccount') sourceAccount?: string,
    @Query('destinationAccount') destinationAccount?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    const filter = {
      sourceAccount,
      destinationAccount,
      startDate,
      endDate
    }
    return  this.transactionsService.findAccountTransaction(filter)
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}
