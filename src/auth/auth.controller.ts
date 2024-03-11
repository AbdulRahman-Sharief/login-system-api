import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    // console.log(credentials);
    return this.authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials);
  }
  @Post('login/social')
  socialLogin(@Body(ValidationPipe) credentials:SocialLoginDTO){
    return this.authService.sociaLogin(credentials);
  }
}
