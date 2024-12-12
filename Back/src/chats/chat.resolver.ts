import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ChatsService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatDto } from './create-chat.dto';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Query(() => [Chat], { name: 'chats', description: 'Fetch all chats' })
  findAll(): Promise<Chat[]> {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat', nullable: true, description: 'Fetch a chat by ID' })
  findOne(@Args('id', { type: () => ID }) id: number): Promise<Chat | null> {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat, { description: 'Create a new chat' })
  createChat(@Args('createChatDto') createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatsService.create(createChatDto);
  }

  @Mutation(() => Boolean, { description: 'Delete a chat by ID' })
  removeChat(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    return this.chatsService.remove(id);
  }

  @Query(() => Number)
  async getId(@Args('id', { type: () => Number }) id: number): Promise<number> {
    const chat = await this.chatsService.findOne(id);
    return chat.id;
  }

  @Query(() => [Chat], { name: 'getMessages', description: 'Fetch chats between two users' })
getMessages(
  @Args('senderId', { type: () => Number }) senderId: number,
  @Args('receiverId', { type: () => Number }) receiverId: number,
): Promise<Chat[]> {
  return this.chatsService.getMessages(senderId, receiverId);
}


}
