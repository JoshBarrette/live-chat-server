import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { WsGuard } from "./socket.guard";
import { JwtModule } from "../auth/jwt/jwt.module";
import { MessageModule } from "src/message/message.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [JwtModule, MessageModule, UserModule],
  providers: [ChatGateway, WsGuard],
})
export class ChatModule {}
