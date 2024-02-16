import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./jwt.guard";
import { JwtController } from "./jwt.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(), // For some reason this needs to be here
    NestJwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "12h" },
    }),
  ],
  providers: [JwtGuard],
  exports: [NestJwtModule, JwtGuard],
  controllers: [JwtController],
})
export class JwtModule {}
