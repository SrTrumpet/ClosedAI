import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event], { name: 'events', description: 'Fetch all events' })
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Query(() => Event, { name: 'event', nullable: true, description: 'Fetch an event by ID' })
  findOne(@Args('id', { type: () => ID }) id: number): Promise<Event | null> {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event, { description: 'Create a new event' })
  createEvent(@Args('createEventDto') createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Mutation(() => Boolean, { description: 'Delete an event by ID' })
  removeEvent(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    return this.eventsService.remove(id);
  }

  @Query(() => Number)
  async getId(@Args('id', { type: () => Number }) id: number): Promise<number> {
    const event = await this.eventsService.findOne(id);
    return event.id;
  }

}
