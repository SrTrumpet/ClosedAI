import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Response } from './entities/form-response.entity';
import { ResponseDto } from './dto/response.dto';

@Resolver(() => Form)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Query(() => [Form], { name: 'forms', description: 'Fetch all forms' })
  findAll(): Promise<Form[]> {
    return this.formsService.findAll();
  }

  @Query(() => Form, { name: 'form', nullable: true, description: 'Fetch a form by ID' })
  findOne(@Args('id', { type: () => ID }) id: number): Promise<Form | null> {
    return this.formsService.findOne(id);
  }

  @Mutation(() => Form, { description: 'Create a new form' })
  createForm(@Args('createFormInput') createFormInput: CreateFormDto): Promise<Form> {
    return this.formsService.create(createFormInput);
  }

  @Mutation(() => Boolean, { description: 'Delete a form by ID' })
  removeForm(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    return this.formsService.remove(id);
  }

  @Query(() => Number)
  async getId(@Args('id', { type: () => Number }) id: number): Promise<number> {
    const form = await this.formsService.findOne(id);
    return form.id;
  }

}
