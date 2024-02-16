import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./google/GoogleStrategy";
import { JwtModule } from "./jwt/jwt.module";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService],
})
export class AuthModule {}
