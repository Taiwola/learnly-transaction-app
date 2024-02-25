import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { AccountInterface } from './interface/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private userService: UserService
  ) {}


  async create(createAccountDto: CreateAccountDto) {
    try {
      const user = await this.userService.getUserById(createAccountDto.userId);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      };

      const random = Math.floor(Math.random() * 10000000000);
      const account = await this.accountModel.create({
        balance: createAccountDto.amount,
        user: createAccountDto.userId,
        account_no: random,
        transaction_pin: createAccountDto.transaction_pin ? createAccountDto.transaction_pin : 1111
      });

      const accountSave = await account.save();
      return {
        message: "account created",
        accountSave
      };
    } catch (error) {
      console.log(error);
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const accounts =  await this.accountModel.find().populate('user');
    return accounts;
  }

  async findOne(id: string) {
    const account = await this.accountModel.findById(id);
    if (!account) {
      return new HttpException("Account not found", HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async findOneByUser(userId: string) {
    try {
      const account = await this.accountModel.findOne({
        user: userId
      });

      if (!account) {
          throw new HttpException("Account not found", HttpStatus.NOT_FOUND);
      }

      return account;
  } catch (error) {
      console.error("Error in findOneByUser:", error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

 async update(id: string, updateAccountDto: UpdateAccountDto) {
    const {amount, transaction_pin} = updateAccountDto;
    try {
      const update = await this.accountModel.findByIdAndUpdate(id, {
        balance: amount,
        transaction_pin
      }, {new: true});
      return update;
    } catch (error) {
      console.log(error);
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      const account = await this.accountModel.findByIdAndDelete(id);
      return {message: "Account deleted successfully"};
    } catch (error) {
     console.log(error);
     return new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }
}
