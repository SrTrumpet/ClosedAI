import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType() // Agregar el decorador ObjectType para GraphQL
@Entity('responses_entity')
export class Response {
  @Field(() => ID, { description: 'Unique identifier of the form' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ description: 'ID del formulario' })
  formId: number;

  @Column()
  @Field({ description: 'ID del usuario' })
  userId: number;

  @Field(() => [String], { description: 'List of answers in the form' })
  @Column('simple-array')
  answers: string[];

  @CreateDateColumn({ comment: 'Date when the response was submitted' })
  @Field()  // Agregar campo a GraphQL
  submittedAt: Date;
}
