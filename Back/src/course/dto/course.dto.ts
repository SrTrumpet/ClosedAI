import { InputType, Field} from '@nestjs/graphql';
import { CourseLevel } from '../enums/course-level.enums';

@InputType()
export class CreateCourseDto{
    @Field()
    nameCourse: string;

    @Field(() => CourseLevel)
    level: CourseLevel;
}