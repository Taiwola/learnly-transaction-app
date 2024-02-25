import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from "../../account/entities/account.entity";


export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
    deposit = "deposit",
    withdrawal = "withdrawal",
    transfer = "transfer",
}

@Schema({timestamps: true})
export class Transaction {
    @Prop({type: Types.ObjectId, ref:'Account', required: true }) 
    sourceAccount: Account

    @Prop({type: Types.ObjectId, ref:'Account' })
    destinationAccount?: Account;

    @Prop({required: true})
    type: TransactionType;

    @Prop({required: true})
    amount: number;

    @Prop({ default: Date.now })
    createdAt: Date;
}


export const transactionSchema = SchemaFactory.createForClass(Transaction);