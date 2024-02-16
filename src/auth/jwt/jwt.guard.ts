import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.body.chat_token;

    try {
      this.jwt.verify(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
