import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { jwtConstants } from "./constant/jwt.constants";

import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";

import { RegisterDto } from "./dto/register.dto"; // Importa el nuevo DTO

import * as bcryptjs from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "./entity/auth.entity";

import { Repository } from "typeorm";
import { AuthResponse } from "./entity/authresponse.entity";
import { UserRoles } from "src/user/enums/user-roles.enums"; // Asegúrate de importar UserRoles

import { v4 as uuidv4 } from 'uuid'; // Importa para generar una nueva contraseña aleatoria
import { MailService } from 'src/mail/mail.service'; // Asegúrate de tener un servicio de correo
import { ForgotPassDto } from "./dto/forgotpass.dto";


@Injectable()
export class AuthService{

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(AuthEntity)
        private readonly authRepository : Repository<AuthEntity>,
        private readonly mailService: MailService // Añade el servicio de correo
    ) {}

     // Método para registrar un nuevo usuario
     async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const { email, password, firstName, lastName, rut} = registerDto;

        // Verifica si el correo ya está en uso
        const existingUser = await this.userService.findOneByEmail(email);
        if (existingUser) {
            throw new BadRequestException('El correo electrónico ya está en uso');
        }

        // Hash de la contraseña para mayor seguridad
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Crea el nuevo usuario en la base de datos
        const newUser = await this.userService.addNewUser({
            firstName,
            lastName,
            rut, // Incluye el rut aquí
            email,
            password: hashedPassword, // Almacena la contraseña hasheada
            role: UserRoles.Student, // Asigna un rol predeterminado
        });

        // Genera un token JWT para el usuario
        const payload = { email: newUser.email, id: newUser.id };
        const token = await this.jwtService.signAsync(payload);

        // Devuelve la respuesta con el token y un mensaje
        return {
            message: 'Registro exitoso',
            token,
        } as AuthResponse;
    }

    async login({ email, password }: LoginDto){
        const user = await this.userService.findOneByEmail(email);

        if(!user){
            throw new UnauthorizedException("Email no valido");
        }

        const auth = await this.authRepository.findOne({where: {idUser: user.id}});
        if (!auth) {
            throw new UnauthorizedException("Usuario sin credenciales de autenticación");
        }

        const isPasswordValid = await bcryptjs.compare(password, auth.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Contraseña o email no válido");
        }

        const payload = { email: user.email, id: user.id, name: user.firstName, lastName: user.lastName};
        const token = await this.jwtService.signAsync(payload);

        return {
            message: "Inicio de sesion exitoso",
            token
        } as AuthResponse
    }

    // Método para "Olvidar Contraseña"
    async forgotPassword(forgotPasswordDto: ForgotPassDto): Promise<string> {
        const { email } = forgotPasswordDto;

        // Verifica si el correo está registrado
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('Correo no encontrado');
        }

        // Genera una nueva contraseña aleatoria
        const newPassword = uuidv4(); // Genera una nueva contraseña aleatoria

        // Hashea la nueva contraseña
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Actualiza la contraseña en la base de datos
        await this.userService.updateUserPassword(user.id, hashedPassword);

        // Envía la nueva contraseña al correo electrónico del usuario
        await this.mailService.sendMail(email, 'Nueva contraseña', `Su nueva contraseña es: ${newPassword}`);

        return 'Se ha enviado una nueva contraseña a su correo electrónico';
    }

    //Agregar service de register
    //conseguirInformacionUsaurio
    //conseguirRol
    //actualizarInformacion
    //findByNames


}