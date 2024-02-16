import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  handleRedirect(req: Request, res: Response): void | { token: string } {
    if (!req.user) {
      res.send({ error: "No user from google" });
    }

    res.redirect(`${process.env.FRONT_END_URL}/?token=${this.jwt.sign(req.user)}`);
    // res.send({
    //   token: this.jwt.sign(req.user),
    // });
  }
}
