import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "./schemas/user.dto";

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

  getUserById(id: string): Promise<User> {
    return new Promise<User>(async (res, rej) => {
      const user = await this.userModel
        .findById(id)
        .then((u) => u)
        .catch((e) => rej(e));
      if (user) {
        res(user);
      }
      rej("User Not Found");
    });
  }
}
