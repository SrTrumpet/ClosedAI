import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

@InputType()
export class CreateChatDto {

  @Field({ description: 'ID of the user that is sending the message' })
  @IsNotEmpty()
  senderId: number;

  @Field({ description: 'ID of the user that is receiving the message' })
  @IsNotEmpty()
  receiverId: number;

  @Field({ description: 'Content of the message' })
  @IsNotEmpty({ message: 'The content field is required' })
  @IsString({ message: 'The content must be a string' })
  content: string;

}
