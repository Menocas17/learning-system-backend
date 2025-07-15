import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // This route gets all the users, this end point it's meant only for admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/get-all')
  findAll() {
    return this.usersService.findAll();
  }

  //Get user by it's id
  @UseGuards(JwtAuthGuard)
  @Get('/my-profile')
  finUserById(@Request() req) {
    const id = req.user.userId;
    console.log(id);
    return this.usersService.findById(id);
  }

  //create a new user
  @Post('/create-user')
  createUser(
    @Body() user: { name: string; email: string; password_plain: string },
  ) {
    return this.usersService.createUser(
      user.name,
      user.email,
      user.password_plain,
    );
  }

  //update a user by it's id
  @UseGuards(JwtAuthGuard)
  @Put('/update-profile')
  updateUserById(
    @Request() req,
    @Body() user: { name: string; email: string; password_plain: string },
  ) {
    const name = user.name || null;
    const email = user.email || null;
    const password_plain = user.password_plain || null;
    const id = req.user.userId!;
    console.log(id);

    return this.usersService.updateUser(name, email, password_plain, id);
  }

  //delete a user
  @UseGuards(JwtAuthGuard)
  @Delete('/delete-profile')
  async deleteUserById(@Request() req) {
    const id = req.user.userId;
    const deletedUser = await this.usersService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      user: deletedUser,
    };
  }
}
