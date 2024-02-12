import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
@Unique(['userId'])
export class TwoFactorConfirmationEntity extends AbstractEntity {
  @Column()
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
