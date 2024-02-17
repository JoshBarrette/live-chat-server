import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;

    if (!token) {
      return false;
    }

    // TODO: user DB
    try {
      this.jwt.verify(token);
      return true;
    } catch (e) {
      return false;
    }

    return true;
  }
}
