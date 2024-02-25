import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Message, MessageSchema } from "./schemas/message.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "../auth/jwt/jwt.module";
import { UserModule } from "src/user/user.module";

/**
 * Handles all messages sent in chat
 */
@Module({
  imports: [
    JwtModule,
    UserModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
