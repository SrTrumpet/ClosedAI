import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(CreateEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(CreateEventDto);
    return this.eventRepository.save(event);
  }


  async remove(id: number): Promise<boolean> {
    const event = await this.findOne(id); // Lanza una excepción si no se encuentra
    await this.eventRepository.delete(event.id);
    return true;
  }
}
