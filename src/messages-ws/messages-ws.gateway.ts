import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';

@WebSocketGateway( { cors: true } )
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService
  ) { }

  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token );

      await this.messagesWsService.register( client, payload.id );

    } catch ( error ) {
      // throw new WsException("invalid")
      client.disconnect();
      return;
    }


    // ! ejemplo de unirse a una sala 
    // client.join("ventas")
    // client.join( user.id )
    // this.wss.to("ventas").emit("")

    this.wss.emit( "clients-updated", this.messagesWsService.getConnectedClients() );
  }

  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id );

    this.wss.emit( "clients-updated", this.messagesWsService.getConnectedClients() );
  }

  @SubscribeMessage( "message-from-client" )
  async handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    // ! Emite únicamente al cliente inicial
    // client.emit( 'message-from-server', {
    //   fullName: "B",
    //   message: payload.message || "no-message!"
    // } );

    // ! Emite a todos menos al cliente inicial 
    // client.broadcast.emit( 'message-from-server', {
    //   fullName: "B",
    //   message: payload.message || "no-message!"
    // } );

    // ! Emite a todos incluyendo al cliente inicial 
    this.wss.emit( 'message-from-server', {
      fullName: this.messagesWsService.getUserFullName( client.id ),
      message: payload.message || "no-message!"
    } );
  }
}
