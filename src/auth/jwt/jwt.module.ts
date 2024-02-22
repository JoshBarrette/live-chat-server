import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtHttpGuard } from "./jwt-http.guard";
import { JwtController } from "./jwt.controller";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { JwtSocketGuard } from "./jwt-socket.guard";

@Module({
  imports: [
    ConfigModule.forRoot(), // For some reason this needs to be here
    NestJwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "12h" },
    }),
    UserModule,
  ],
  providers: [JwtHttpGuard, JwtSocketGuard],
  exports: [NestJwtModule, JwtHttpGuard, JwtSocketGuard],
  controllers: [JwtController],
})
export class JwtModule {}
