import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@ObjectType() // Marca esta clase como un tipo GraphQL
@Entity()
export class MessageEntity {
  @Field(() => Int) // Expone el campo como un entero en GraphQL
  @PrimaryGeneratedColumn()
  id: number;

  @Field() // Expone el campo como un string en GraphQL
  @Column()
  content: string;

  @Field(() => UserEntity) // Relación con UserEntity
  @ManyToOne(() => UserEntity, (user) => user.sentMessages)
  sender: UserEntity;

  @Field(() => UserEntity) // Relación con UserEntity
  @ManyToOne(() => UserEntity, (user) => user.receivedMessages)
  recipient: UserEntity;

  @Field() // Expone el campo como un Date en GraphQL
  @CreateDateColumn()
  timestamp: Date;
}
