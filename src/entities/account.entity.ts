import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class AccountEntity extends AbstractEntity {
  @Column()
  userId: string;
  @Column()
  type: string;
  @Column()
  provider: string;
  @Column()
  providerAccountId: string;
  @Column('text')
  refresh_token: string;
  @Column('text')
  access_token: string;
  @Column()
  expires_at: number;
  @Column()
  token_type: string;
  @Column()
  scope: string;
  @Column('text')
  id_token: string;
  @Column()
  session_state: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user: UserEntity;
}
