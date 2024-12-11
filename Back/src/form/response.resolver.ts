import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ResponsesService } from './response.service';
import { Response } from './entities/form-response.entity';
import { ResponseDto } from './dto/response.dto';

@Resolver(() => Response)
export class ResponsesResolver {
  constructor(private readonly responsesService: ResponsesService) {}

  @Query(() => [Response])
  async getAllResponses() {
    return this.responsesService.getAllResponses();
  }

  @Query(() => [Response])
  async getResponsesByFormId(@Args('formId') formId: number) {
    return this.responsesService.getResponsesByFormId(formId);
  }

  @Query(() => Response)
  async getResponseById(@Args('id') id: number) {
    return this.responsesService.getResponseById(id);
  }

  @Mutation(() => Response, { description: 'Create a new response for a form' })
  async createResponse(
    @Args('responseDto') responseDto: ResponseDto,
  ): Promise<Response> {
    return this.responsesService.createResponse(responseDto);
  }
}
