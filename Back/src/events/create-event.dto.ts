import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

@InputType()
export class CreateEventDto {

  @Field({ description: 'ID of the user who submitted the form' })
  @IsNotEmpty()
  creatorId: number;

  @Field({ description: 'ID of the course' })
  @IsNotEmpty()
  courseId: number;

  @Field({ description: 'Title of the form' })
  @IsNotEmpty({ message: 'The title field is required' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @Field({ nullable: true, description: 'Optional description of the form' })
  @IsString({ message: 'The description must be a string' })
  description?: string;

  @Field({ description: 'Due date of the event' })
  @IsNotEmpty({ message: 'The due date field is required' })
  @IsDate({ message: 'The due date must be a valid date' })
  dueDate: Date;
}
