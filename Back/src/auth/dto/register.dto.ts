import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RegisterDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    firstName: string; // Nombre del usuario

    @Field()
    @IsString()
    @IsNotEmpty()
    lastName: string; // Apellido del usuario

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string; // Correo electrónico del usuario

    @Field()
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string; // Contraseña del usuario (mínimo 6 caracteres)

    @Field() // Asegúrate de incluir el decorador Field para GraphQL
    @IsString()
    @IsNotEmpty()
    rut: string; // Agrega el campo rut (ej. número de identificación)
}
