
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true })
  account_no: number;

  @Prop()
  transaction_pin: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const accountSchema = SchemaFactory.createForClass(Account);