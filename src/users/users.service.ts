import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  async getUserByEmail(body: {email:string}) {
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    // console.log(body);
    // console.log(user);
    return user;
  }
  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }
  async getUserByUsername(username:string,provider:string){
    // const user = await this.userRepo.findOne({where:{username}});
    const user = await this.userRepo.createQueryBuilder('user').innerJoinAndSelect('user.accounts','account').where('user.username= :username',{username}).andWhere('account.provider= :provider',{provider}).getOne();
    console.log('USER FROM SERVICE:' ,user)
    return user;
  }
}
