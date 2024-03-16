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
async oAuthLogin(req:any,userFound:any){
  if (!req.user) {
    return 'No user from google';
  }
  //query the user in the db to know if the user exist or not.
  if(!userFound){
    //create user
    const userCredentials = {
      username:`${req.user.name.givenName}-${req.user.name.familyName}`,
      email:req.user.email,
      password:null,
      emailVerifiedAt:new Date().toISOString(),
      image:req.user.picture
    }
    const UserData =await this.userRepo.save(userCredentials)
    // console.log(UserData)
   
  console.log('SAVED USER: ',UserData);
    //create account
    const accountCredentials = {
      userId:UserData.id,
      type:req.user.type,
      provider:req.user.provider,
      providerAccountId:req.user.providerId,
      access_token:req.user._accessToken,
      refresh_token:req.user._refreshToken,
      emailVerified:req.user.email_verified,
      token_type:'jwt',
      scope:'profile',
    }
  const account = this.accountRepo.create(accountCredentials);
  const accountData = await account.save();
  console.log(accountData);
    console.log('USER: ',req.user)
    console.log('REQ: ',req.user)
    return {
      message: 'User information from google',
      user: req.user,
      UserData,
      accountData
     
    };
  }
  if(userFound.image !== req.user.picture){
    const user =await this.userRepo.update(userFound.id,{image:req.user.picture})
    return {message:"User image updated upon login.",userFound}
  }
  return {message:"User Found!",userFound}
}

async oAuthGitHubLogin(req:any,userFound:any){
  if (!req.user) {
    return 'No user from google';
  }
  //query the user in the db to know if the user exist or not.
  if(!userFound){
    //create user
    const userCredentials = {
      username:req.user.name,
      email:null,
      password:null,
      emailVerifiedAt:new Date().toISOString(),
      image:req.user.picture
    }
    const UserData =await this.userRepo.save(userCredentials)

  console.log('SAVED USER: ',UserData);
    //create account
    const accountCredentials = {
      userId:UserData.id,
      type:req.user.type,
      provider:req.user.provider,
      providerAccountId:req.user.providerId,
      access_token:req.user._accessToken,
      refresh_token:null,
      emailVerified:true,
      token_type:'jwt',
      scope:'profile',
    }
  const account = this.accountRepo.create(accountCredentials);
  const accountData = await account.save();
  console.log(accountData);
    console.log('USER: ',req.user)
    console.log('REQ: ',req.user)
    return {
      message: 'User information from google',
      user: req.user,
      UserData,
      accountData
     
    };
  }
  if(userFound.image !== req.user.picture){
    const user =await this.userRepo.update(userFound.id,{image:req.user.picture})
    return {message:"User image updated upon login.",userFound}
  }
  return {message:"User Found!",userFound}
}
// const payload  = {email:user.email,name:user.name};
// const jwt = await this.jwtService.sign(payload);
// return {jwt};
//provider,providerId, email,name,picture

}

