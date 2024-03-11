import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt-auth.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './guards/google-oauth.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory:()=>({
      secret:process.env.JWT_SECRET,
      signOptions:{
        expiresIn:'3d',
      },
      global:true,
    })
  }),ConfigModule.forRoot(),TypeOrmModule.forFeature([UserEntity,AccountEntity])],
  providers: [AuthService,JwtGuard ,GoogleOauthGuard,GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
