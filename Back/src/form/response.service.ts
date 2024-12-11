import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/form-response.entity';
import { ResponseDto } from './dto/response.dto';
import { NotFoundException } from '@nestjs/common';
import { Form } from './entities/form.entity';

@Injectable()
export class ResponsesService {

  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,  // Asegúrate de que Form esté inyectado
  ) {}

  async createResponse(responseDto: ResponseDto): Promise<Response> {
    const response = this.responseRepository.create({
      formId: Number(responseDto.formId),  // Convertir a número
      userId: Number(responseDto.userId),  // Convertir a número
      answers: responseDto.answers,        // Mantener las respuestas tal como están
    });

    // Guardar la respuesta
    return this.responseRepository.save(response);
  }
  
}
