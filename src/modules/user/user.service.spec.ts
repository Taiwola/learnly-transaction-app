import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRoles } from './entities/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { HttpException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const userModelMock = {
    findById: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }

  class MockDocument extends Model<any> {
    constructor(data: any) {
      super(data);
      Object.assign(this, data); // Assign properties to the document instance
    }
  }

  const mockUser = {
    _id: "65d60c645cff292ccc9d1946",
    firstname: "Olanitori",
    lastname: "oluwaseun",
    email: "seunolantori@gmail.com",
    roles: UserRoles.ADMIN,
    createdAt: new Date(),
  }
  
  const createMockUser:createMockUser = {
    _id: "65d60c645cff292ccc9d1946",
    firstname: "Olanitori",
    lastname: "oluwaseun",
    email: "seunolantori@gmail.com",
    roles: UserRoles.ADMIN,
    password: "kchcwcnui788fjv",
    createdAt: new Date()
  }

  interface createMockUser {
    _id: ObjectId | string,
    firstname: string,
    lastname: string,
    email: string,
    roles: UserRoles.ADMIN,
    createdAt: Date,
    password: string
  }

  type CreateMockUserType = {
    _id: ObjectId | string,
    firstname: string,
    lastname: string,
    email: string,
    roles: UserRoles.ADMIN,
    createdAt: Date
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, 
        { provide: getModelToken(User.name), useValue: userModelMock }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe("find", () => {
      it("it should return all user", async () => {
        jest.spyOn(model, "find").mockResolvedValue([mockUser]);
        const result = await service.findAll();

        expect(result).toEqual([mockUser]);

      })
  })

 describe('findById', () => {
  it('should find and return a user by id', async () => {
    jest.spyOn(model, 'findById').mockResolvedValue(mockUser);
    const result = await service.findOne(mockUser._id.toString());

    expect(model.findById).toHaveBeenCalledWith(mockUser._id);
    expect(result).toEqual(mockUser);
  });


  it('should throw not found exception if user is not found', async () => {
    jest.spyOn(model, 'findById').mockResolvedValue(null);
    await expect(service.findOne(mockUser._id.toString())).rejects.toThrow(HttpException);

    expect(model.findById).toHaveBeenCalledWith(mockUser._id);
  });
 })

 

 describe("create", () => {
  it('should create and return user', async () => {
    const createUserDto: CreateUserDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };

    const hashPwd = await bcrypt.hash(createUserDto.password, 10);
    const newUser =  model.create({
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email: createUserDto.email,
      password: hashPwd,
    });

    const savedUser = await model.create({
      id: '123',
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email: createUserDto.email,
      password: hashPwd,
    });

    jest.spyOn(model, 'findOne').mockResolvedValue(null);
    
    const result = await service.createUser(createUserDto);

    expect(result).toBeInstanceOf(CreateUserResponse);
    expect(result).toEqual(savedUser.toJSON());
    expect(model.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
    expect(model.create).toHaveBeenCalledWith({
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email: createUserDto.email,
      password: hashPwd,
    });
    expect(newUser).toEqual(savedUser);
  });


  });
 });


  

