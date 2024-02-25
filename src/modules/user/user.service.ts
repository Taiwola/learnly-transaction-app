import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}


  // methods
  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const {firstname, lastname, email, password} = createUserDto;

    const userExist = await this.userModel.findOne({email: email});

    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }

    const hashPwd = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.userModel.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPwd
      });

      // const user = await newUser.save();

      return new CreateUserResponse(newUser);

    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(email: string) {
    const user = await this.userModel.findOne({email});
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  // route functions

  async findAll(): Promise<CreateUserResponse[]> {
    const users = await this.userModel.find();
    return users.map((user) => new CreateUserResponse(user));
  }

  async findOne(id: string): Promise<CreateUserResponse> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    return new CreateUserResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<CreateUserResponse> {
    const {email} = updateUserDto;

    if (email) {
      const userWithSameEmail = await this.userModel.findOne({ email: email });
      if (userWithSameEmail) {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
  }

  try {
    const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    return new CreateUserResponse(updateUser);
  } catch (error) {
    console.log(error);
    throw new HttpException(
      'Internal server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      return {message: "User deleted successfully"};
    } catch (error) {
      console.log(error);
      return new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}
