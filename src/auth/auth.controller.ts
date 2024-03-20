import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { GoogleStrategy } from './guards/google-oauth.strategy';
import { UsersService } from 'src/users/users.service';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { GithubStrategy } from './guards/github-oauth.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/decorators/Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService
    ,private usersService:UsersService
    ) {}

  @Public()
  @Post('/register')
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    // console.log(credentials);
    return this.authService.register(credentials);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req:any) {
    //you can remove LoginDTO.
    return this.authService.login(req);
  }
  @Public()
  @Post('login/social')
  socialLogin(@Body(ValidationPipe) credentials:SocialLoginDTO){
    return this.authService.sociaLogin(credentials);
  }
@Public()
  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req:Request , @Res() res:Response){
    return {msg:'Authentication with Google'}
  }
  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async handleGoogleRedirect(@Req() req:any){
    // const user =await this.usersService.getUserByUsername(`${req.user.name.givenName}-${req.user.name.familyName}`,'google');
    const user = await this.usersService.getUserByEmail({email:req.user.email})
 console.log(user);
    return this.authService.oAuthLogin(req,user)
  }
@Public()
  @Get('callback/github')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(@Req() req:Request , @Res() res:Response){
    console.log('Authentication with GitHub')
    return {msg:'Authentication with GitHub'}
  }
  @Public()
  @Get('github/redirect')
  @UseGuards(GithubOauthGuard)
  async handleGithubRedirect(@Req() req:any){
   
    const user =await this.usersService.getUserByUsername(req.user.name,'github');
 if(user) console.log('USER FOUND: ', user);
 console.log("REQ.DATA",req.data);
 console.log("REQ USER",req.user);
    return this.authService.oAuthGitHubLogin(req,user)
    // return {msg:"HandleGitHubRedirect"}
  }


  @Get('/profile')
  getProfile(@Req() req:any){
    return req.user;
  }
}
