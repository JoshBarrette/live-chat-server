import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserToken } from "src/types/UserToken";

@Injectable()
export class JwtHttpGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    try {
      const token: UserToken = this.jwt.verify(req.headers.authorization);
      const user = await this.userService.handleUserForGuard(token);
      req.user = user;
      return true;
    } catch (e) {
      res.redirect("/api/auth/jwt/clearCookie");
      return false;
    }
  }
}
