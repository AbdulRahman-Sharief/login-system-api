import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import {
  PasswordResetToken,
  VerificationToken,
} from 'src/entities/token.entity';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    private jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepo: Repository<PasswordResetToken>,
    private emailService: EmailService,
    private usersService: UsersService,

    @InjectRepository(VerificationToken)
    private verificationToken: Repository<VerificationToken>,
  ) {}

  async register(credentials: RegisterDTO) {
    console.log(credentials);
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username or Email has already been taken');
      throw new InternalServerErrorException();
    }
  }
  async getVerificationToken(email: string, req: any) {
    console.log(email);
    try {
      const user = this.userRepo.findOne({ where: { email } });
      if (!user)
        throw new NotFoundException(
          'No such user with this email. go and signup.',
        );
      const verificationToken = this.verificationToken.create({ email });
      const { token } = await verificationToken.save();
      console.log(token);
      const verificationURL = `${req.protocol}://${req.get('host')}/api/v1/auth/register/verfy-token/${token}`;
      console.log(verificationURL);
      const SendEmail = await this.emailService.verficationToken(
        email,
        verificationURL,
      );
      return { token };
    } catch (error) {
      console.log(error);
    }
  }
  async verifyToken(token: string) {
    const NOW = new Date();
    console.log(NOW);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const verficationToken = await this.verificationToken.findOne({
      where: {
        token: token,
        expires: MoreThan(NOW),
      },
    });
    console.log(verficationToken);
    if (!verficationToken)
      throw new NotFoundException(
        'token is not found or may have been expired!',
      );

    const { email } = verficationToken;
    const user = await this.usersService.getUserByEmail({ email });
    user.emailVerifiedAt = NOW;
    const verifiedUser = await user.save();
    console.log(verifiedUser);
    verficationToken.token = null;
    verficationToken.expires = null;
    await verficationToken.save();
    return {
      msg: 'Congratulations, your email has been successfully verified! you can now go and login.',
    };
  }
  async login(req: any) {
    console.log(req);
    const user = await this.usersService.getUserById(req.user.id);
    console.log(user);
    if (user.emailVerifiedAt === null)
      throw new UnauthorizedException(
        'you have not verified your email yet, please check your inbox and verify that the email belongs to you.',
      );
    const payload = { sub: req.user.id, username: req.user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  async sociaLogin(credentials: SocialLoginDTO) {
    try {
      const account = this.accountRepo.create(credentials);
      await account.save();
      return account;
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
  async oAuthLogin(req: any, userFound: any) {
    if (!req.user) {
      return 'No user from google';
    }
    //query the user in the db to know if the user exist or not.
    if (!userFound) {
      //create user
      const userCredentials = {
        username: null,
        email: req.user.email,
        password: null,
        emailVerifiedAt: new Date().toISOString(),
        image: req.user.picture,
      };
      const UserData = await this.userRepo.save(userCredentials);
      // console.log(UserData)

      console.log('SAVED USER: ', UserData);
      //create account
      const accountCredentials = {
        userId: UserData.id,
        type: req.user.type,
        provider: req.user.provider,
        providerAccountId: req.user.providerId,
        access_token: req.user._accessToken,
        refresh_token: req.user._refreshToken,
        emailVerified: req.user.email_verified,
        token_type: 'jwt',
        scope: 'profile',
      };
      const account = this.accountRepo.create(accountCredentials);
      const accountData = await account.save();
      console.log(accountData);
      console.log('USER: ', req.user);
      console.log('REQ: ', req.user);
      return {
        message: 'User information from google',
        user: req.user,
        UserData,
        accountData,
      };
    }
    if (userFound.image !== req.user.picture) {
      const user = await this.userRepo.update(userFound.id, {
        image: req.user.picture,
      });
      return { message: 'User image updated upon login.', userFound };
    }
    return { message: 'User Found!', userFound };
  }

  async oAuthGitHubLogin(req: any, userFound: any) {
    if (!req.user) {
      return 'No user from google';
    }
    //query the user in the db to know if the user exist or not.
    if (!userFound) {
      //create user
      const userCredentials = {
        username: req.user.name,
        email: null,
        password: null,
        emailVerifiedAt: new Date().toISOString(),
        image: req.user.picture,
      };
      const UserData = await this.userRepo.save(userCredentials);

      console.log('SAVED USER: ', UserData);
      //create account
      const accountCredentials = {
        userId: UserData.id,
        type: req.user.type,
        provider: req.user.provider,
        providerAccountId: req.user.providerId,
        access_token: req.user._accessToken,
        refresh_token: null,
        emailVerified: true,
        token_type: 'jwt',
        scope: 'profile',
      };
      const account = this.accountRepo.create(accountCredentials);
      const accountData = await account.save();
      console.log(accountData);
      console.log('USER: ', req.user);
      console.log('REQ: ', req.user);
      return {
        message: 'User information from google',
        user: req.user,
        UserData,
        accountData,
      };
    }
    if (userFound.image !== req.user.picture) {
      const user = await this.userRepo.update(userFound.id, {
        image: req.user.picture,
      });
      return { message: 'User image updated upon login.', userFound };
    }
    return { message: 'User Found!', userFound };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    const isPasswordCorrect = await user.comparePassword(password);

    console.log(isPasswordCorrect);
    if (user && isPasswordCorrect) {
      return user;
    }
    return null;
  }
  async forgotPassword(email: string, req: any) {
    //check if user exists in our db.
    console.log(email);
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(
        'email or username provided are not found in our database!',
      );
    //generate jwtToken with expiration of 10 mins and store it in the database.
    const reset_token = this.passwordResetTokenRepo.create({ email });
    const token = await reset_token.save();
    console.log(reset_token);
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/reset-password/${token.token}`;
    console.log(resetURL);
    const SendEmail = await this.emailService.resetPassword(email, resetURL);
    return { reset_token };
  }
  async resetPassword(
    token: string,
    password: string,
    passwordConfirm: string,
  ) {
    const NOW = new Date();
    console.log(NOW);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const tokenOfUser = await this.passwordResetTokenRepo.findOne({
      where: {
        token: token,
        expires: MoreThan(NOW),
      },
    });
    console.log(tokenOfUser);
    if (!tokenOfUser)
      throw new NotFoundException(
        'token is not found or may have been expired!',
      );
    const user = await this.usersService.getUserByEmail({
      email: tokenOfUser.email,
    });
    if (!user)
      throw new NotFoundException('There is no user attached to this token.');
    if (password === passwordConfirm) {
      user.password = await bcrypt.hash(password, 10);
      user.passwordChangedAt = new Date();
      await user.save();
      tokenOfUser.token = null;
      tokenOfUser.expires = null;
      await tokenOfUser.save();
      return {
        msg: 'password reset successfully, you can now go and login with the new credentials.',
      };
    }
  }
}
