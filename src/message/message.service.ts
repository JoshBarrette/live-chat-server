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

  /**
   * Adds new messages to the DB
   * @param message The message to add
   * @returns The added message
   */
  async addMessage(message: MessageDto) {
    return await this.messageModel.create({
      sender: message.sender,
      content: message.content,
    });
  }

  /**
   * Gets the 10 most recent messages sent in the last 5 minutes
   * @returns The messages
   */
  async getRecentMessages() {
    const fiveMinutes = new Date(Date.now() - 5 * 60 * 1000);

    return await this.messageModel
      .find({ createdAt: { $gt: fiveMinutes } })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName picture")
      .limit(10);
  }
}
