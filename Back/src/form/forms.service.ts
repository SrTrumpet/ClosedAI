import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {}

  async findAll(): Promise<Form[]> {
    return this.formRepository.find();
  }

  async findOne(id: number): Promise<Form> {
    const form = await this.formRepository.findOne({ where: { id } });
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  async create(createFormInput: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create(createFormInput);
    return this.formRepository.save(form);
  }


  async remove(id: number): Promise<boolean> {
    const form = await this.findOne(id); // Lanza una excepción si no se encuentra
    await this.formRepository.delete(form.id);
    return true;
  }
}
