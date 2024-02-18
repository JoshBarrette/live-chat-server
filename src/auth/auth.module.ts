import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./google/GoogleStrategy";
import { JwtModule } from "./jwt/jwt.module";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { MessageModule } from "src/message/message.module";

@Module({
  imports: [JwtModule, UserModule, MessageModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService],
})
export class AuthModule {}
