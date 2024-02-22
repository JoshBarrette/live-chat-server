import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "./schemas/user.dto";
import { UserToken } from "src/types/UserToken";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async updateUserPicture(picture: string, email: string) {
    // If we don't await then the update won't go through
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { picture } },
      { new: true },
    );
  }

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
