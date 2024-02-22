import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { JwtModule } from "../auth/jwt/jwt.module";
import { MessageModule } from "src/message/message.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [JwtModule, MessageModule, UserModule],
  providers: [ChatGateway],
})
export class ChatModule {}
