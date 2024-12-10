import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entity/user.entity';

@ObjectType()
@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  senderId: number;

  @Column()
  @Field()
  receiverId: number;

  @Column()
  @Field()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt: Date;

  // Relación con el usuario que envía el mensaje
  @ManyToOne(() => UserEntity, user => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  @Field(() => UserEntity)
  sender: UserEntity;

  // Relación con el usuario que recibe el mensaje
  @ManyToOne(() => UserEntity, user => user.receivedMessages)
  @JoinColumn({ name: 'receiverId' })
  @Field(() => UserEntity)
  receiver: UserEntity;
}
