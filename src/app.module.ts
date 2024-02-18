import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { ChatModule } from "./chat/chat.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ChatModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MessageModule,
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
