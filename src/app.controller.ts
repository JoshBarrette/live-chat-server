import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  /**
   * Hello World
   * @returns Hello World
   */
  @Get()
  getHello() {
    return "Hello World";
  }
}
