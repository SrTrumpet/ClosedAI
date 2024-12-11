import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Entity representing a form with questions' })
@Entity('forms_entity')
export class Form {
  @Field(() => ID, { description: 'Unique identifier of the form' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ description: 'ID del creador' })
  creatorId: number;

  @Column()
  @Field({ description: 'ID del curso' })
  courseId: number;

  @Field({ description: 'Title of the form' })
  @Column()
  title: string;

  @Field({ nullable: true, description: 'Optional description of the form' })
  @Column({ nullable: true })
  description: string;

  @Field(() => [String], { description: 'List of questions in the form' })
  @Column('simple-array')
  questions: string[];

  @Field({ description: 'Date when the form was created' })
  @CreateDateColumn()
  createdAt: Date;

}
