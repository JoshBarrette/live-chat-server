import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./schemas/user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("add")
  async addUser(@Body() newUser: UserDto) {
    return await this.userService.addUser(newUser).catch((e) => {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Get("getById")
  async getById(@Body("id") id: string) {
    return await this.userService.getUserById(id).catch((e) => {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
