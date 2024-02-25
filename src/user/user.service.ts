import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "./schemas/user.dto";
import { UserToken } from "src/types/UserToken";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Adds a new User to the DB
   * @param newUser The user to add
   * @returns The added user
   */
  addUser(newUser: UserDto): Promise<User> {
    return new Promise<User>(async (res, rej) => {
      try {
        const user = await this.userModel.create(newUser);
        res(user);
      } catch (e) {
        rej(e);
      }
    });
  }

  /**
   * Queries the DB for a User based on their email
   * @param email The email of the User we are looking for
   * @returns The User with the given email
   */
  getUserByEmail(email: string): Promise<User> {
    return new Promise<User>(
      async (res, rej) =>
        await this.userModel
          .findOne({ email: email })
          .then((user) => {
            res(user);
          })
          .catch((e) => rej(e)),
    );
  }

  /**
   * Queries the DB for a User based on their ID
   * @param id The ID of the User we are looking for
   * @returns The User with the given ID
   */
  getUserById(id: string): Promise<User> {
    return new Promise<User>(
      async (res, rej) =>
        await this.userModel
          .findById(id)
          .then((user) => {
            res(user);
          })
          .catch((e) => rej(e)),
    );
  }

  /**
   * Updates a User's picture after finding them with their email
   * @param picture The URL of the new picture
   * @param email The email of the User we are updating
   */
  async updateUserPicture(picture: string, email: string) {
    // If we don't await then the update won't go through
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { picture } },
      { new: true },
    );
  }

  /**
   * Handles User queries for JWT guards. Adds users if they are not already in
   * the DB and checks if their picture needs to be updated.
   * @param token The token of the User we are checking
   * @returns The DB of the User, new or otherwise
   */
  async handleUserForGuard(token: UserToken): Promise<User> {
    const user = await this.getUserByEmail(token.email);
    if (!user) {
      var newUser = await this.addUser({
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        picture: token.picture,
      });
    } else if (user.picture !== token.picture) {
      await this.updateUserPicture(user.picture, user.email);
    }

    return user ?? newUser;
  }
}
