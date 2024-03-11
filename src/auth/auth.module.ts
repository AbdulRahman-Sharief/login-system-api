import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AccountEntity } from 'src/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,AccountEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
