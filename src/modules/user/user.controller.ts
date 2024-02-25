import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdPipe } from './validator/validator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { UserRoles } from './entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
