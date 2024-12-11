import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './chat.service';
import { ChatsResolver } from './chat.resolver';
import { Chat } from './chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])], 
  providers: [ChatsService, ChatsResolver],   
  exports: [ChatsService],                    
})
export class ChatsModule {}
