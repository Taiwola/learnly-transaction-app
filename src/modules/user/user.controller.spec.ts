import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("findById", () => {
    it("should throw badrequestException if invalid ID is provided", async () => {
      const id = "invalidId";

      const isIdValid =  jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);

      expect(isIdValid).toHaveBeenCalledWith(id);
      isIdValid.mockRestore();
    })
  })
});
