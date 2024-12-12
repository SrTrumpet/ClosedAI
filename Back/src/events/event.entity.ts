import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Entity representing an event' })
@Entity('events_entity')
export class Event {
  @Field(() => ID, { description: 'Unique identifier of the event' })
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

  @Field({ description: 'Date when the form was created' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Date when the form has to be completed' })
  @CreateDateColumn()
  dueDate: Date;

}
