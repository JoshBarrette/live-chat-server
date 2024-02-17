import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    try {
      this.jwt.verify(req.headers.authorization);
      return true;
    } catch (e) {
      res.redirect("/api/auth/jwt/clearCookie");
      return false;
    }
  }
}
