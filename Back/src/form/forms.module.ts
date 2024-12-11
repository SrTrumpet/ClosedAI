import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsResolver } from './forms.resolver';
import { Form } from './entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form])], // Importación de la entidad Form
  providers: [FormsService, FormsResolver],   // Registro del servicio y resolver
  exports: [FormsService],                    // Exporta el servicio si es necesario en otros módulos
})
export class FormsModule {}
