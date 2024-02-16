import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { WsGuard } from "./socket.guard";
import { JwtModule } from "../auth/jwt/jwt.module";

@Module({
  providers: [ChatGateway, WsGuard],
  imports: [JwtModule],
})
export class ChatModule {}
