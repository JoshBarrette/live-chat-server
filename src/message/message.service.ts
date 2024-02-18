import { Injectable } from "@nestjs/common";
import { Message } from "./schemas/message.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageDto } from "./schemas/message.dto";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async addMessage(message: MessageDto) {
    return await this.messageModel.create({
      sender: message.sender,
      content: message.content,
    });
  }
}
