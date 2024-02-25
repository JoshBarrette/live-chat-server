import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserSignInGuard } from "src/user/user-sign-in.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Call this endpoint to login
   */
  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  handleLogin() {}

  /**
   * Handles the redirect from Google after logging in
   * @param req
   * @param res
   * @returns AuthService handler
   */
  @Get("google/redirect")
  @UseGuards(AuthGuard("google"), UserSignInGuard)
  handleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.handleRedirect(req, res);
  }
}
