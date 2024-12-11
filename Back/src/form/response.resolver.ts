import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Response } from './entities/form-response.entity';
import { ResponseDto } from './dto/response.dto';
import { ResponsesService } from './response.service';

@Resolver(() => Response)
export class ResponsesResolver {
  constructor(private readonly responsesService: ResponsesService) {}

  @Mutation(() => Response)
  async createResponse(@Args('responseDto') responseDto: ResponseDto): Promise<Response> {
    return this.responsesService.createResponse(responseDto);
  }
}
