import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as crypto from 'crypto';
@Entity()
@Unique(['email', 'token'])
export class VerificationToken extends AbstractEntity {
  @Column()
  email: string;
  @Column({ unique: true,nullable:true })
  token: string;
  @Column({nullable:true})
  expires: Date;

  @BeforeInsert()
  async createPasswordResetToken(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.expires =new Date(Date.now() + 24 * 60 * 60 * 1000)
    console.log(this.expires);
    return resetToken;
  }
}

@Entity()
@Unique(['email', 'token'])
export class PasswordResetToken extends AbstractEntity {
  @Column({nullable:true})
  email: string;
  @Column({ unique: true ,nullable:true})
  token: string;
  @Column({nullable:true})
  expires: Date;

  @BeforeInsert()
  async createPasswordResetToken(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.expires =new Date(Date.now() + 10 * 60 * 1000)
    console.log(this.expires);
    return resetToken;
  }
}

@Entity()
@Unique(['email', 'token'])
export class TwoFactorToken extends AbstractEntity {
  @Column()
  email: string;
  @Column({ unique: true })
  token: string;
  @Column()
  expires: Date;
}
