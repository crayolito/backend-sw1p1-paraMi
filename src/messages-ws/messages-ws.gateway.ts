import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  FrontendInfoEventoSPDto,
  FrontendSalaPrivadDto,
  InfoSalaSocketDto,
  InfoSPDto,
  UsuarioDto,
} from './dto/initChatG.dto';
import { MessagesWsService, SalaSocket } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export default class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wsServer: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleDisconnect(client: Socket) {
    // this.messagesWsService.removeClient(client);
    // this.wsServer.emit(
    //   'clientes-conectados',
    //   this.messagesWsService.getConnectedClients(),
    // );
    console.log('Cliente desconectado');
  }
  handleConnection(client: Socket, ...args: any[]) {
    // this.messagesWsService.addClient(client);
    // this.wsServer.emit(
    //   'clientes-conectados',
    //   this.messagesWsService.getConnectedClients(),
    // );
    console.log('Cliente conectado');
  }

  @SubscribeMessage('init-chatGeneral')
  onInitChatGeneral(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    this.messagesWsService.addClient(payload[0]);
    // console.log(this.messagesWsService.getConnectedClients());

    // LOGIC : MANDA MENSAJE SOLO AL QUE LO ENVIO
    // client.emit('chat-general', payload);

    // LOGIC : MANDA MENSAJE A TODOS INCLUYENDO AL QUE LO ENVIO
    // this.wsServer.emit(
    //   'clientes-conectados',
    //   this.messagesWsService.getConnectedClients(),
    // );

    // LOGIC : MANDA MENSAJE A TODOS EXCEPTO AL QUE LO ENVIO
    client.broadcast.emit(
      'clientes-conectados',
      this.messagesWsService.getConnectedClients(),
    );

    // LOGIC : INGRESAR A UNA SALA DE CHAT
    // client.join('sala1');
    // LOGIC : MANDA MENSAJE A UNA SALA DE CHAT
    // this.wsServer.to('sala1').emit('chat-general', payload);
  }

  @SubscribeMessage('entra-sala')
  onInitSalaChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: InfoSalaSocketDto,
  ) {
    const sala: string = payload[0].sala;
    const usuario: UsuarioDto = payload[0].usuario;
    const salaNew: SalaSocket = {
      name: sala,
      clients: [usuario],
    };

    // LOGIC : VERIFICAMOS SI LA SALA YA ESTA CREADA
    const salaEncontrada: SalaSocket = this.messagesWsService
      .getSalaInfoClientes()
      .find((salaSocket) => salaSocket.name == sala);

    // LOGIC : VERIFICAMOS SI LA SALA NO ESTA CREADA
    if (!salaEncontrada) {
      this.messagesWsService.addSala(salaNew);
    } else {
      const clienteEncontrado = salaEncontrada.clients.find(
        (cliente) => cliente.id == usuario.id,
      );

      // LOGIC: VERIFICAMOS SI EL USUARIO YA ESTA EN LA SALA
      if (!clienteEncontrado) {
        salaEncontrada.clients.push(usuario);
      }
    }

    console.log(payload[0]);

    // LOGIC : UNIR AL CLIENTE A LA SALA
    client.join(sala);

    // LOGIC : ENVIAR MENSAJE A TODOS LOS CLIENTESDE LA SALA EXCEPTO AL QUE LO ENVIO
    // if (!salaEncontrada) {
    //   client.broadcast
    //     .to(sala)
    //     .emit('clientes-conectados-sala', salaNew.clients);
    // } else {
    //   client.broadcast
    //     .to(sala)
    //     .emit('clientes-conectados-sala', salaEncontrada.clients);
    // }

    // LOGIC : MANDA MENSAJE A TODOS LOS CLIENTES DE LA SALA
    if (!salaEncontrada) {
      this.wsServer.to(sala).emit('clientes-conectados-sala', salaNew.clients);
    } else {
      this.wsServer
        .to(sala)
        .emit('clientes-conectados-sala', salaEncontrada.clients);
    }
  }

  @SubscribeMessage('init-sala-privada')
  onInitSalaPrivada(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FrontendSalaPrivadDto,
  ) {
    console.log(payload[0]);
    const idSala: string = payload[0].idSala;
    const usuario: UsuarioDto = payload[0].usuario;
    const infoSalaPrivada: InfoSPDto = {
      infoBase: {
        id: idSala,
        usuarios: [usuario],
      },
      infoEventosSw1: [],
    };

    const salaEncontrada = this.messagesWsService
      .getSalaPrivadasInfo()
      .find((sala) => sala.infoBase.id == idSala);

    if (!salaEncontrada) {
      this.messagesWsService.addSalaPrivada(infoSalaPrivada);
    } else {
      const clienteEncontrado = salaEncontrada.infoBase.usuarios.find(
        (cliente) => cliente.id == usuario.id,
      );

      if (!clienteEncontrado) {
        salaEncontrada.infoBase.usuarios.push(usuario);
      }
    }

    client.join(idSala);

    if (!salaEncontrada) {
      this.wsServer
        .to(idSala)
        .emit(
          'clientes-conectados-sala-privada',
          infoSalaPrivada.infoBase.usuarios,
        );
    } else {
      this.wsServer
        .to(idSala)
        .emit(
          'clientes-conectados-sala-privada',
          salaEncontrada.infoBase.usuarios,
        );
    }
  }

  @SubscribeMessage('evento-new-sp')
  onEventoSalaPrivada(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FrontendInfoEventoSPDto,
  ) {
    const idSala: string = payload[0].idSala;
    const evento: string = payload[0].evento;

    const salaEncontrada = this.messagesWsService
      .getSalaPrivadasInfo()
      .find((sala) => sala.infoBase.id == idSala);

    if (salaEncontrada) {
      salaEncontrada.infoEventosSw1.push(evento);
    }

    client.broadcast
      .to(idSala)
      .emit('updated-eventos', salaEncontrada.infoEventosSw1);
  }

  @SubscribeMessage('delete-evento-sp')
  onBorrarEventoSP(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FrontendInfoEventoSPDto,
  ) {
    const idSala: string = payload[0].idSala;
    const evento: string = payload[0].evento;
    console.log(payload);
    const salaEncontrada = this.messagesWsService
      .getSalaPrivadasInfo()
      .find((sala) => sala.infoBase.id == idSala);

    if (salaEncontrada) {
      const index = salaEncontrada.infoEventosSw1.indexOf(evento);
      if (index > -1) {
        salaEncontrada.infoEventosSw1.splice(index, 1);
      }
    }

    console.log(salaEncontrada.infoEventosSw1);
    client.broadcast
      .to(idSala)
      .emit('updated-eventos', salaEncontrada.infoEventosSw1);
  }
}
