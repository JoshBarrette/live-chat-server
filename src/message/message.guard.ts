import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { UserToken } from "src/types/UserToken";
import { UserService } from "src/user/user.service";

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const req = context.switchToHttp().getRequest();
    const token = client.handshake.auth.token;
    const userToken: UserToken = this.jwt.decode(token);
    const user = await this.userService.getUserByEmail(userToken.email);

    req.user_id = user._id.toString();

    return true;
  }
}
