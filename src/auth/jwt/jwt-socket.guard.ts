import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { UserToken } from "src/types/UserToken";
import { UserService } from "src/user/user.service";

/**
 * Handles JWT verification for Socket requests
 */
@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const req = context.switchToHttp().getRequest();

    try {
      const token: UserToken = this.jwt.verify(client.handshake.auth.token);
      const user = await this.userService.handleUserForGuard(token);
      req.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
