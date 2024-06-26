import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('/register')
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    // console.log(credentials);
    return this.authService.register(credentials);
  }
  @Public()
  @Post('/register/verification')
  getVerificationToken(@Body() body: { email: string }, @Req() req: Request) {
    // return email
    return this.authService.getVerificationToken(body.email, req);
  }
  @Public()
  @Get('/register/verfy-token/:token')
  verifyToken(@Param('token') token: string) {
    // return token
    return this.authService.verifyToken(token);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: any) {
    //you can remove LoginDTO.
    return this.authService.login(req);
  }
  @Public()
  @Post('login/social')
  socialLogin(@Body(ValidationPipe) credentials: SocialLoginDTO) {
    return this.authService.sociaLogin(credentials);
  }
  @Public()
  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuthCallback(@Req() _req: Request, @Res() _res: Response) {
    return { msg: 'Authentication with Google' };
  }
  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async handleGoogleRedirect(@Req() req: any) {
    // const user =await this.usersService.getUserByUsername(`${req.user.name.givenName}-${req.user.name.familyName}`,'google');
    const user = await this.usersService.getUserByEmail({
      email: req.user.email,
    });
    console.log(user);
    return this.authService.oAuthLogin(req, user);
  }
  @Public()
  @Get('callback/github')
  @UseGuards(GithubOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async githubAuthCallback(@Req() _req: Request, @Res() _res: Response) {
    console.log('Authentication with GitHub');
    return { msg: 'Authentication with GitHub' };
  }
  @Public()
  @Get('github/redirect')
  @UseGuards(GithubOauthGuard)
  async handleGithubRedirect(@Req() req: any) {
    const user = await this.usersService.getUserByUsername(
      req.user.name,
      'github',
    );
    if (user) console.log('USER FOUND: ', user);
    console.log('REQ.DATA', req.data);
    console.log('REQ USER', req.user);
    return this.authService.oAuthGitHubLogin(req, user);
    // return {msg:"HandleGitHubRedirect"}
  }

  @Public()
  @Post('/forgot-password')
  forgetPassword(@Body() body: { email: string }, @Req() req: Request) {
    // console.log(`${req.protocol}://${req.get('Host')}${req.originalUrl}`);
    // console.log(req.protocol)
    return this.authService.forgotPassword(body.email, req);
  }

  @Public()
  @Post('/reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string; passwordConfirm: string },
  ) {
    console.log(token, body);
    return this.authService.resetPassword(
      token,
      body.password,
      body.passwordConfirm,
    );
  }

  @Get('/profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
