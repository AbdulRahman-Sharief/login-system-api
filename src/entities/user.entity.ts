import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString } from 'class-validator';
import { Exclude, instanceToPlain } from 'class-transformer';
import { AccountEntity } from './account.entity';
import { TwoFactorConfirmationEntity } from './tfc.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, nullable: true })
  @IsString()
  username: string;

  @Column({ unique: true, nullable: true })
  @IsEmail()
  email: string;
  @Column({ nullable: true, default: null })
  emailVerifiedAt: Date;
  @Column({ nullable: true, default: null })
  @IsString()
  image: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => AccountEntity, (account) => account.user)
  @JoinColumn({ name: 'accountId' })
  accounts: AccountEntity[];

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
  @OneToOne(() => TwoFactorConfirmationEntity, (tfc) => tfc.id)
  @JoinColumn({ name: 'tfcId' })
  twoFactorConfirmation: TwoFactorConfirmationEntity;
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true, default: new Date() }) //temporarliy
  passwordChangedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password !== null) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  async comparePassword(attemptedPassword: string) {
    return await bcrypt.compare(attemptedPassword, this.password);
  }
  toJSON() {
    return instanceToPlain(this);
  }

  changePasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        this.passwordChangedAt.getTime() / 1000,
      );
      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }
}
