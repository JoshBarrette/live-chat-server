import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  /**
   * Handles the redirect from Google after logging in
   * @param req
   * @param res
   * @returns Sets cookie on res and redirects to front end. On error
   * it will send an error and redirect to front end with no cookie and
   * try to clear any cookie that might be there already.
   */
  handleRedirect(req: Request, res: Response) {
    if (!req.user) {
      res
        .send({ error: "No user from google" })
        .clearCookie("chat_token")
        .redirect(`${process.env.FRONT_END_URL}`);

      return;
    }

    const newUser = req.user as User;
    const newToken = this.jwt.sign({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      picture: newUser.picture,
    });

    return res
      .cookie("chat_token", newToken, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        secure: true,
      })
      .redirect(`${process.env.FRONT_END_URL}`);
  }
}
