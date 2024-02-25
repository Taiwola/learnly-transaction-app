import {IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum} from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    sourceAccount: string;

    @IsOptional()
    @IsString()
    destinationAccount?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    transaction_pin: number;
}


export class FilterDto {
    sourceAccount?: string;
    destinationAccount?: string;
    startDate?: Date;
    endDate: Date;
}