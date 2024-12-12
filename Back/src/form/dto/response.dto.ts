import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

@InputType()
export class ResponseDto {

  @Field({ description: 'ID of the user who submitted the response' })
  @IsNotEmpty()
  userId: number;

  @Field({ description: 'ID of the form being answered' })
  @IsNotEmpty()
  formId: number;

  @Field(() => [String], { description: 'List of answers in the form' })
  @IsArray({ message: 'Answers must be an array' })
  @ArrayNotEmpty({ message: 'Answers cannot be empty' })
  answers: string[];
}
