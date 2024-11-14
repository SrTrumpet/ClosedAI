import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageDto {
  @Field()
  senderId: number;

  @Field()
  receiverId: number;

  @Field()
  content: string;
}
