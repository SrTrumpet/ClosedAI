import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Inject } from '@nestjs/common';

const MESSAGE_SENT = 'MESSAGE_SENT';

@Resolver(() => MessageEntity)
export class MessagesResolver {
  constructor(
    private readonly messageService: MessagesService,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Mutation(() => MessageEntity)
  async sendMessage(
    @Args('createMessageInput') createMessageDto: CreateMessageDto
  ) {
    const message = await this.messageService.create(createMessageDto);

  // Publicar el evento
  await this.pubSub.publish(MESSAGE_SENT, { 
    messageSent: message 
  });

  return message;
}


  @Query(() => [MessageEntity])
  async getConversation(
    @Args('user1Id') user1Id: number,
    @Args('user2Id') user2Id: number
  ) : Promise<MessageEntity[]>  {
    return this.messageService.findConversation(user1Id, user2Id);
  }

  @Subscription(() => MessageEntity, {
    name: 'messageSent',
    filter: (payload, variables) => {
      return payload.messageSent.receiverId === variables.receiverId;
    }
  })
  messageSent(@Args('receiverId') receiverId: number) {
    return this.pubSub.asyncIterator(MESSAGE_SENT);
  }
  

}
