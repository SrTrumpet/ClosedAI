import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constant/jwt.constants";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { AuthEntity } from "./entity/auth.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([AuthEntity]),
        JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions:{
            expiresIn:'8000s'
        },
        }),
    ],
    providers: [AuthService,AuthResolver],
})
export class AuthModule {}