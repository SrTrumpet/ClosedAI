import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])], // Importación de la entidad Form
  providers: [EventsService, EventsResolver],   // Registro del servicio y resolver
  exports: [EventsService],                    // Exporta el servicio si es necesario en otros módulos
})
export class EventsModule {}
