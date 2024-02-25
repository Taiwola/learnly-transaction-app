import { Exclude } from "class-transformer";
import {IsString, IsNumber, IsNotEmpty, IsOptional} from "class-validator";
import { Account } from "../entities/account.entity";
import { AccountInterface } from "../interface/account.interface";
import { ObjectId } from "mongoose";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;


    @IsOptional()
    @IsNumber()
    transaction_pin: number
}


export class AccountResponseDto {
    _id: string;
    user: string;
    balance: number
    account_no: number
    createdAt: Date

    @Exclude()
    transaction_pin: number

    constructor(account: AccountInterface) {
        this._id = account._id.toString(),
        this.balance = account.balance,
        this.account_no = account.account_no,
        this.createdAt = account.createdAt,
        this.user = account.user
    }
}