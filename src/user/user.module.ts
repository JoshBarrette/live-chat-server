import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserSignInGuard } from "./user-sign-in.guard";

/**
 * Handles all the users that sign in and send messages in chat
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserSignInGuard],
  controllers: [UserController],
  exports: [UserService, UserSignInGuard],
})
export class UserModule {}
