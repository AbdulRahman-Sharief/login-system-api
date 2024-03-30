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
import { Public } from 'src/decorators/Public.decorator';
import { EmailService } from 'src/email/email.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService,
    private readonly emailService:EmailService) {}

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
  @Public()
  @Post('test-send-email')
  async SendEmail(@Body() SendEmailDTO:{recipient:string; body:string}){
    // console.log(SendEmailDTO);
    await this.emailService.resetPassword(SendEmailDTO.recipient,SendEmailDTO.body)
    
  }
}
