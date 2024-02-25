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
import { MessageService } from "src/message/message.service";
import { JwtService } from "@nestjs/jwt";
import { UserToken } from "src/types/UserToken";
import { Request } from "express";
import { User } from "src/user/schemas/user.schema";
import { JwtSocketGuard } from "src/auth/jwt/jwt-socket.guard";

@WebSocketGateway({ namespace: "chat" })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private connectedUsers: string[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly jwt: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token: UserToken = this.jwt.verify(client.handshake.auth.token);
      this.connectedUsers.push(
        this.getFullName(token.firstName, token.lastName),
      );
      this.updateConnectUsers();
    } catch {}

    const newMessages = await this.messageService.getRecentMessages();
    if (!newMessages) return;

    const messagesToSend = newMessages
      .map((mes) => {
        return {
          username: this.getFullName(mes.sender.firstName, mes.sender.lastName),
          content: mes.content,
          picture: mes.sender.picture,
        };
      })
      .reverse();
    client.emit("recent_messages", { data: messagesToSend });
  }

  handleDisconnect(client: Socket) {
    try {
      const token: UserToken = this.jwt.verify(client.handshake.auth.token);
      this.removeUser(token.firstName, token.lastName);
      this.updateConnectUsers();
    } catch {}
  }

  updateConnectUsers() {
    this.server.emit("update_connected_users", {
      data: { users: this.connectedUsers },
    });
  }

  removeUser(first: string, last: string) {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u !== this.getFullName(first, last),
    );
  }

  getFullName(first: string, last: string | undefined): string {
    return first + (last !== undefined ? " " + last : "");
  }

  // @SubscribeMessage("message")
  // handleMessage(
  //   @MessageBody() content: string,
  //   @ConnectedSocket() socket: Socket,
  // ): void {
  //   socket.send({ data: "Received Message: " + content });
  // }

  @SubscribeMessage("send_message")
  @UseGuards(JwtSocketGuard)
  handleSendMessage(
    @MessageBody("user")
    user: {
      firstName: string;
      lastName: string;
      picture: string;
    },
    @MessageBody("content") content: string,
    @ConnectedSocket() socket: Socket,
    @Req() request: Request,
  ): void {
    if (!content) return;

    this.server.emit("new_message", {
      data: {
        username: this.getFullName(user.firstName, user.lastName),
        content,
        picture: user.picture,
      },
    });

    this.messageService.addMessage({
      sender: (request.user as User)._id,
      content: content,
    });
  }

  @SubscribeMessage("user_disconnect")
  @UseGuards(JwtSocketGuard)
  handleUserDisconnect(
    @ConnectedSocket() socket: Socket,
    @Req() request: Request,
  ): void {
    const user = request.user as User;
    this.removeUser(user.firstName, user.lastName);
    this.updateConnectUsers();
  }
}
