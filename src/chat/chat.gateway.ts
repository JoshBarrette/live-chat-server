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
import e, { Request } from "express";
import { User } from "src/user/schemas/user.schema";
import { JwtSocketGuard } from "src/auth/jwt/jwt-socket.guard";
import { UserService } from "src/user/user.service";

type ConnectedUser = {
  userID: string;
  username: string;
  count: number;
};

@WebSocketGateway({ namespace: "chat" })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  /**
   * Keeps track of who is signed in and how many instances that they have open
   */
  private connectedUsers: ConnectedUser[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Handles new client connections and sends any recent messages
   * @param client The new client
   * @param args
   * @returns void
   */
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token: UserToken = this.jwt.verify(client.handshake.auth.token);
      await this.addUser(token);
    } catch {
    } finally {
      this.updateConnectUsers();
    }

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

  async handleDisconnect(client: Socket) {
    try {
      const token: UserToken = this.jwt.verify(client.handshake.auth.token);
      await this.removeUserByToken(token);
    } catch {}
  }

  updateConnectUsers() {
    this.server.emit("update_connected_users", {
      data: { users: this.connectedUsers.map((u) => u.username) },
    });
  }

  async addUser(token: UserToken) {
    const user = await this.userService.getUserByEmail(token.email);
    const username = this.getFullName(user.firstName, user.lastName);

    for (let i = 0; i < this.connectedUsers.length; i++) {
      if (this.connectedUsers[i].userID.toString() !== user._id.toString())
        continue;

      this.connectedUsers[i].count++;
      return;
    }

    this.connectedUsers.push({
      userID: user._id.toString(),
      username,
      count: 1,
    });
  }

  async removeUserByToken(token: UserToken) {
    const user = await this.userService.getUserByEmail(token.email);
    this.removeUser(user);
  }

  async removeUserByID(id: string) {
    const user = await this.userService.getUserById(id);
    this.removeUser(user);
  }

  removeUser(user: User) {
    this.connectedUsers = this.connectedUsers.filter((u) => {
      if (u.userID.toString() !== user._id.toString()) return true;

      u.count--;
      if (u.count <= 0) {
        return false;
      }

      return true;
    });
    this.updateConnectUsers();
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
    this.removeUserByID(user._id);
  }
}
