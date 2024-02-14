import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async getUserByEmail(@Body() body: any) {
    const user = await this.userService.getUserByEmail(body);
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return user;
  }
  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return user;
  }
}
