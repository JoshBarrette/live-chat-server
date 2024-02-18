import { Req, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "./socket.guard";
import { MessageGuard } from "src/message/message.guard";
import { MessageService } from "src/message/message.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket, ...args: any[]) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage("message")
  handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.send({ data: "Received Message: " + content });
  }

  @SubscribeMessage("send_message")
  @UseGuards(WsGuard, MessageGuard)
  handleSendMessage(
    @MessageBody("user")
    user: {
      firstName: string;
      lastName: string;
      picture: string;
    },
    @MessageBody("message") message: string,
    @ConnectedSocket() socket: Socket,
    @Req() request: any,
  ): void {
    this.server.emit("new_message", {
      data: {
        username:
          user.firstName +
          (user.lastName !== undefined ? " " + user.lastName : ""),
        message,
        picture: user.picture,
      },
    });

    this.messageService.addMessage({
      sender: request.user_id,
      content: message,
    });
  }
}
