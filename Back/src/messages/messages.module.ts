import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    MessagesResolver,
    MessagesService,
    PubSub, // Asegúrate de que PubSub esté disponible aquí
  ],
})
export class MessagesModule {}
