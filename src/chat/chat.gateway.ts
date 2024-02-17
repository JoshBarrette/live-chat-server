import { UseGuards } from "@nestjs/common";
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

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

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
  @UseGuards(WsGuard)
  handleSendMessage(
    @MessageBody("user")
    user: {
      firstName: string;
      lastName: string;
      picture: string;
    },
    @MessageBody("message") message: string,
    @ConnectedSocket() socket: Socket,
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
  }
}
