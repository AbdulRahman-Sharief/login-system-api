import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  async getUserByEmail(body: any) {
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    // console.log(body);
    // console.log(user);
    return user;
  }
  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }
}
