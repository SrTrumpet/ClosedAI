import { Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import { CreateSemesterDto } from './dto/semester.dto';
import { UpdateSemesterDto } from './dto/updateSemester.dto';
import { DeleteSemesterDto } from './dto/deleteSemester.dto';
import { SemesterService } from './semester.service';
import { SemesterEntity } from './entity/semester.entity';



@Resolver()
export class SemesterResolver{
    constructor (private readonly semesterService: SemesterService){}

    @Mutation(() => Boolean)
    async createSemester(@Args('createSemesterDto') createSemesterDto: CreateSemesterDto): Promise<boolean>{
        return this.semesterService.addNewSemester(createSemesterDto);
    }

    @Mutation(() => Boolean)
    async deleteSemester(@Args('deleteSemesterDto') deletesemesterDto: DeleteSemesterDto): Promise<boolean>{
        return this.semesterService.deleteSemester(deletesemesterDto);
    }

    @Mutation(() => Boolean)
    async updateSemester(@Args('updateSemesterDto') updateSemesterDto: UpdateSemesterDto): Promise<boolean> {
        return this.semesterService.updateSemester(updateSemesterDto);
    }

    @Query(() => [SemesterEntity])
    async getAllSemester(): Promise<SemesterEntity[]>{
        return this.semesterService.getAllSemester();
    }
}