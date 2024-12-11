import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatDto } from './create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id } });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async create(CreateChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(CreateChatDto);
    return this.chatRepository.save(chat);
  }

  async remove(id: number): Promise<boolean> {
    const chat = await this.findOne(id); // Lanza una excepción si no se encuentra
    await this.chatRepository.delete(chat.id);
    return true;
  }
}
