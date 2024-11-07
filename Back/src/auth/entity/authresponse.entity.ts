import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
    @Field()
    token: string;

    @Field()
    message :string;

    @Field()
    verificacion:boolean;

    @Field()
    role : string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    rut: string;

    @Field()
    email: string;

    @Field()
    id: number;

    @Field()
    isChangePassword: boolean;
}