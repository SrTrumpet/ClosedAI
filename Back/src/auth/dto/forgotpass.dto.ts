import { IsEmail, IsNotEmpty} from "class-validator";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ForgotPassDto{

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string; //correo electrónico del usuario

}