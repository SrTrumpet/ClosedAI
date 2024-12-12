import { Form } from './entities/form.entity';
// responses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/form-response.entity'; 
import { ResponsesResolver } from './response.resolver';
import { ResponsesService } from './response.service';

@Module({
  imports: [TypeOrmModule.forFeature([Response, Form])],  // Asegúrate de que la entidad Response esté registrada aquí
  providers: [ResponsesService, ResponsesResolver],
  exports: [ResponsesService],  // Si es necesario, exporta el servicio
})
export class ResponsesModule {}
