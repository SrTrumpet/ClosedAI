import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Entity representing a form with questions' })
@Entity('chats_entity')
export class Chat {
  @Field(() => ID, { description: 'Unique identifier of the chat' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ description: 'ID del que envia' })
  senderId: number;

  @Column()
  @Field({ description: 'ID del que manda' })
  receiverId: number;

  @Field({ description: 'contenido del chat' })
  @Column()
  content: string;

  @Field({ description: 'Fecha que se envia el mensaje' })
  @CreateDateColumn()
  createdAt: Date;

}
