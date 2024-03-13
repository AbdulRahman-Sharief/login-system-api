import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { GoogleStrategy } from './guards/google-oauth.strategy';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService
    ,private usersService:UsersService
    ) {}
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

  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req:Request , @Res() res:Response){
    return {msg:'Authentication with Google'}
  }
  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async handleRedirect(@Req() req:any){
   
    const user =await this.usersService.getUserByEmail({email:req.user.email});
 
    return this.authService.oAuthLogin(req,user)
  }
}
