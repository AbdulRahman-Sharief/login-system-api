import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt-auth.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './guards/google-oauth.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { GithubStrategy } from './guards/github-oauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtGuardStrategy } from './guards/jwt-auth.strategy';
import { LocalStrategy } from './guards/local-auth.strategy';
import { PasswordResetToken } from 'src/entities/token.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:['.env']
  }),PassportModule.register({ defaultStrategy: 'jwt' }),JwtModule.registerAsync({
    useFactory:async ()=>({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions:{
        expiresIn:'3h',
      },
      global:true,
    })
  }),TypeOrmModule.forFeature([UserEntity,AccountEntity,PasswordResetToken])],
  providers: [AuthService,JwtGuard ,GoogleOauthGuard,GoogleStrategy,GithubOauthGuard,GithubStrategy,LocalStrategy,UsersService,JwtGuardStrategy,EmailService,UsersService],
  controllers: [AuthController],
  exports: [JwtModule, PassportModule]
})
export class AuthModule {}
