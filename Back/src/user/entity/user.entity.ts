import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MessageEntity } from 'src/chat/entity/message.entity';

@ObjectType()
@Entity()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  rut: string;

  @Field()
  @Column()
  role: string;

  // Relación con los mensajes enviados
  @Field(() => [MessageEntity], { nullable: true }) // Exponer como un array de MessageEntity
  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  // Relación con los mensajes recibidos
  @Field(() => [MessageEntity], { nullable: true }) // Exponer como un array de MessageEntity
  @OneToMany(() => MessageEntity, (message) => message.recipient)
  receivedMessages: MessageEntity[];
}
