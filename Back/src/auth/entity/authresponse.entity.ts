import { Field, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "src/user/entity/user.entity";

@ObjectType()
export class AuthResponse {
    @Field()
    token: string;

    @Field()
    message: string;

    @Field()
    verificacion: boolean;

    @Field()
    role: string;

    @Field()
    firstName: string;

    @Field()
    id: number;

    @Field()
    isChangePassword: boolean;

    @Field(() => UserEntity)
    user: UserEntity; // Incluye todos los datos del usuario
}
