import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }
@Schema()
export class User {
    @Prop({required: true})
    firstname: string;

    @Prop({required: true})
    lastname: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string

    @Prop({ default: UserRoles.USER })
    roles: UserRoles;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const userSchema = SchemaFactory.createForClass(User);

