import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => MessageEntity)
export class MessagesResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly pubSub: PubSub, // Inyectar PubSub correctamente
  ) {}

  @Mutation(() => MessageEntity)
  async sendMessage(@Args('content') content: string) {
    const message = await this.messageService.create(content);

    // Emitir el evento de suscripción
    this.pubSub.publish('messageSent', { messageSent: message });

    return message;
  }

  @Subscription(() => MessageEntity, {
    name: 'messageSent',
  })
  messageSent() {
    // Se usa asyncIterator para las suscripciones
    return this.pubSub.asyncIterator('messageSent');
  }
}
