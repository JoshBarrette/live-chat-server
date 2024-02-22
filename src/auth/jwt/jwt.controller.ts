import { Controller, Get, Param, Res } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserToken } from "src/types/UserToken";
import { Response } from "express";

@Controller("auth/jwt")
export class JwtController {
  constructor(private jwt: JwtService) {}

  @Get("verify/:id")
  handleVerify(@Param("id") s: string) {
    try {
      const decode: UserToken = this.jwt.decode(s);
      if (decode) {
        return {
          valid: true,
          firstName: decode.firstName,
          lastName: decode.lastName,
          picture: decode.picture,
        };
      }
    } catch (e) {
      return { valid: false };
    }
  }

  @Get("clearCookie")
  clearCookie(@Res({ passthrough: true }) res: Response) {
    return res.clearCookie("chat_token");
  }
}
