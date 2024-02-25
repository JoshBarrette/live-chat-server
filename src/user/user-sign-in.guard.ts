import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserToken } from "src/types/UserToken";
import { UserService } from "./user.service";

/**
 * Gets the user from the Google redirect and adds it to the DB. If
 * the user is already in the DB then it will check that the picture
 * provided is up to date and update it if necessary.
 */
@Injectable()
export class UserSignInGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const requestUser = req.user as UserToken;

    const user = await this.userService.getUserByEmail(requestUser.email);

    if (!user) {
      this.userService.addUser({
        firstName: requestUser.firstName,
        lastName: requestUser.lastName,
        email: requestUser.email,
        picture: requestUser.picture,
      });
    } else if (requestUser.picture !== user.picture) {
      this.userService.updateUserPicture(
        requestUser.picture,
        requestUser.email,
      );
    }

    return true;
  }
}
