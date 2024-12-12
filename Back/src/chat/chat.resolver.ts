import { Resolver, Query, Mutation, Args, Subscription, Int, Float } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { MessageEntity } from './entity/message.entity';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';

const pubSub = new PubSub() as any;

@Resolver(() => MessageEntity)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [MessageEntity])
  async getMessages(
    @Args('senderId', { type: () => Int }) senderId: number,
    @Args('recipientId', { type: () => Int }) recipientId: number,
  ): Promise<MessageEntity[]> {
    try {
      return await this.chatService.getMessages(senderId, recipientId);
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      throw new GraphQLError('Error al obtener los mensajes', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }


  @Mutation(() => MessageEntity)
  async sendMessage(
    @Args('content') content: string,
    @Args('senderId', { type: () => Int }) senderId: number,
    @Args('recipientId', { type: () => Int }) recipientId: number,
  ): Promise<MessageEntity> {
    console.log('Datos recibidos en el resolver:', { content, senderId, recipientId });

    if (!content || !senderId || !recipientId) {
      throw new GraphQLError('Faltan datos para enviar el mensaje', {
        extensions: {
          code: 'BAD_USER_INPUT',
          details: { content, senderId, recipientId },
        },
      });
    }

    const message = await this.chatService.sendMessage(content, senderId, recipientId);
    pubSub.publish('messageSent', { messageSent: message });
    return message;
  }

  
  @Subscription(() => MessageEntity, {
    filter: (payload, variables) => {
      console.log('Payload:', payload);
      console.log('Variables:', variables);
      return payload.messageSent.recipient.id === variables.recipientId;
    },
  })
  messageSent(@Args('recipientId', { type: () => Float }) recipientId: number) {
    return pubSub.asyncIterator('messageSent');
  }
}
