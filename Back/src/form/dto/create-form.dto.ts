import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

@InputType()
export class CreateFormDto {

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

  @Field(() => [String], { description: 'List of questions in the form' })
  @IsArray({ message: 'Questions must be an array' })
  @ArrayNotEmpty({ message: 'Questions cannot be empty' })
  questions: string[];
}
