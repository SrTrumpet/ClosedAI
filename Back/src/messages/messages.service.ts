import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';


@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const newMessage = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<MessageEntity[]> {
    return this.messageRepository.find();
  }

  async findMessagesBySender(senderId: number): Promise<MessageEntity[]> {
    return this.messageRepository.find({ 
      where: { senderId },
      order: { createdAt: 'DESC' }
    });
  }

  async findMessagesByReceiver(receiverId: number): Promise<MessageEntity[]> {
    return this.messageRepository.find({ 
      where: { receiverId },
      order: { createdAt: 'DESC' }
    });
  }

  async findConversation(user1Id: number, user2Id: number): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ],
      order: { createdAt: 'ASC' }
    });
  }
}

