import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ParseObjectIdPipe } from '../user/validator/validator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserRoles } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';


@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.accountService.findOne(id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get('user/:userId')
  findOneByUser(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.accountService.findOneByUser(userId);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
