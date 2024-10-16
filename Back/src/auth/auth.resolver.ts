import { Resolver, Args, Mutation, Query, Context } from "@nestjs/graphql";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto"; // Importa el nuevo DTO

import { ForgorPassDto } from "./dto/forgotpass.dto";
import { AuthResponse } from "./entity/authresponse.entity";

import { AuthService } from "./auth.service";


@Resolver()
export class AuthResolver {

    constructor (private readonly authService : AuthService){}

    //Agregar mutation de registrar

    // Mutación para registrar un nuevo usuario
    @Mutation(returns => AuthResponse)
    async register(@Args('registerDto') registerDto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(registerDto);
    }


    //Find User by Name
    //actualizar Informacion
    //Conseguir rol

    @Mutation(returns => AuthResponse)
    async login(@Args() logindDto : LoginDto ): Promise<AuthResponse>{
        return this.authService.login(logindDto);
    }

}