import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/message.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity])
  ],
  providers: [
    MessagesResolver,
    MessagesService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    }
  ],
  exports: [MessagesService]
})
export class MessagesModule {}
