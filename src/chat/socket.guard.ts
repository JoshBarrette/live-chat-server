import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UserToken } from "../types/UserToken";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new WsException("UNAUTHORIZED");
    }
    // const a: UserToken = this.jwt.decode(token);
    // TODO: user DB here

    return true;
  }
}
