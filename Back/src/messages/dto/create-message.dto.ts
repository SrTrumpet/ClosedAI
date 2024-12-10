
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateMessageDto {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;
}
