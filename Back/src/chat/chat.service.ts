import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entity/message.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { GraphQLError } from 'graphql';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getMessages(senderId: number, recipientId: number): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: senderId }, recipient: { id: recipientId } },
        { sender: { id: recipientId }, recipient: { id: senderId } },
      ],
      relations: ['sender', 'recipient'], // Asegúrate de cargar las relaciones
      order: { timestamp: 'ASC' },
    });
  }
  
  

  async sendMessage(content: string, senderId: number, recipientId: number): Promise<MessageEntity> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const recipient = await this.userRepository.findOne({ where: { id: recipientId } });
  
    if (!sender || !recipient) {
      throw new GraphQLError('Remitente o destinatario no encontrados', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
  
    const message = this.messageRepository.create({
      content,
      sender,
      recipient,
    });
  
    return await this.messageRepository.save(message);
  }
}
