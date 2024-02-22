import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserSignInGuard } from "src/user/user-sign-in.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  handleLogin() {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"), UserSignInGuard)
  handleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.handleRedirect(req, res);
  }
}
