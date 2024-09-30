import { Injectable } from '@nestjs/common';
import { InfoSPDto, UsuarioDto } from './dto/initChatG.dto';

export interface SalaSocket {
  name: string;
  clients: UsuarioDto[];
}

@Injectable()
export class MessagesWsService {
  private connectedClients: UsuarioDto[] = [];
  private salaInfoClientes: SalaSocket[] = [];
  private salaPrivadasInfo: InfoSPDto[] = [];

  addSalaPrivada(sala: InfoSPDto) {
    this.salaPrivadasInfo.push(sala);
  }

  removeSalaPrivada(sala: InfoSPDto) {
    delete this.salaPrivadasInfo[sala.infoBase.id];
  }

  getSalaPrivadasInfo(): InfoSPDto[] {
    return this.salaPrivadasInfo;
  }

  addClient(cliente: UsuarioDto) {
    this.connectedClients.push(cliente);
  }

  removeClient(cliente: UsuarioDto) {
    delete this.connectedClients[cliente.id];
  }

  getConnectedClients(): UsuarioDto[] {
    return this.connectedClients;
  }

  addSala(sala: SalaSocket) {
    this.salaInfoClientes.push(sala);
  }

  removeSala(sala: SalaSocket) {
    delete this.salaInfoClientes[sala.name];
  }

  getSalaInfoClientes(): SalaSocket[] {
    return this.salaInfoClientes;
  }
}
