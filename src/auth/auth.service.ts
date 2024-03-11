import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { SocialLoginDTO } from './dtos/login.social.dto';
import { AccountEntity } from 'src/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountEntity) private accountRepo : Repository<AccountEntity>
  ) {}

  async register(credentials: RegisterDTO) {
    console.log(credentials);
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username has already been taken');
      throw new InternalServerErrorException();
    }
  }
  async login(credentials: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: credentials.email },
      });
      if (!(await user.comparePassword(credentials.password)))
        throw new UnauthorizedException('Invalid Credentials');
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials');
    }
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
async oAuthLogin(req){
  if (!req.user) {
    return 'No user from google';
  }
console.log(JSON.stringify(req.profile))
  return {
    message: 'User information from google',
    user: req.user,
   
  };
}

// const payload  = {email:user.email,name:user.name};
// const jwt = await this.jwtService.sign(payload);
// return {jwt};

}

