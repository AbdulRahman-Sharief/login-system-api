import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class AccountEntity extends AbstractEntity {
  @Column()
  userId: number;
  @Column()
  type: string;
  @Column()
  provider: string;
  @Column()
  providerAccountId: string;
  @Column('text',{nullable:true})
  refresh_token: string;
  @Column('text')
  access_token: string;
  // @Column()
  // expires_at: Date;
  @Column()
  token_type: string;
  @Column()
  scope: string;
  // @Column('text')
  // id_token: string;
  // @Column()
  // session_state: string;

  @ManyToOne(() => UserEntity, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
