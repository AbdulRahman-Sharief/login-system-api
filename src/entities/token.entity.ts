import { Column, Entity, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
@Entity()
@Unique(['email', 'token'])
export class VerificationToken extends AbstractEntity {
  @Column()
  email: string;
  @Column({ unique: true })
  token: string;
  @Column()
  expires: Date;
}

@Entity()
@Unique(['email', 'token'])
export class PasswordResetToken extends AbstractEntity {
  @Column()
  email: string;
  @Column({ unique: true })
  token: string;
  @Column()
  expires: Date;
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
