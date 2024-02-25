import { ObjectId } from "mongoose";

export interface AccountInterface {
    _id: ObjectId;
    user: string;
    balance: number
    account_no: number
    createdAt: Date
    transaction_pin: number
}