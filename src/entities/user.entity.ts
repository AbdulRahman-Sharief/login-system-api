import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString } from 'class-validator';
import { Exclude, instanceToPlain } from 'class-transformer';
import { AccountEntity } from './account.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsString()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;
  @Column()
  emailVerifiedAt: Date;
  @Column()
  @IsString()
  image: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'accountId' })
  accounts: AccountEntity;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
  @OneToOne(() => TwoFactorConfirmationEntity, (tfc) => tfc.id)
  @JoinColumn({ name: 'tfcId' })
  twoFactorConfirmation: TwoFactorConfirmationEntity;
  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  async comparePassword(attemptedPassword: string) {
    return await bcrypt.compare(attemptedPassword, this.password);
  }
  toJSON() {
    return instanceToPlain(this);
  }
}

@Entity()
@Unique(['userId'])
export class TwoFactorConfirmationEntity extends AbstractEntity {
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
