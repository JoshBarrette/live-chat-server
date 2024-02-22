import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { UserToken } from "src/types/UserToken";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const req = context.switchToHttp().getRequest();

    const token: UserToken = this.jwt.decode(client.handshake.auth.token);
    if (!token) {
      return false;
    }

    const user = await this.userService.handleUserForGuard(token);
    req.user = user;

    return true;
  }
}
