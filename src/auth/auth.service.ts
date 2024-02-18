import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  handleRedirect(req: Request, res: Response): void | { token: string } {
    if (!req.user) {
      res
        .send({ error: "No user from google" })
        .redirect(`${process.env.FRONT_END_URL}`);
    }

    return res
      .cookie("chat_token", this.jwt.sign(req.user), {
        path: "/",
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        secure: true,
      })
      .redirect(`${process.env.FRONT_END_URL}`);
    // res.send({
    //   token: this.jwt.sign(req.user),
    // });
  }
}
