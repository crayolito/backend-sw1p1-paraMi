import { WebSocketGateway } from '@nestjs/websockets';
import { ChatSalaService } from './chat-sala.service';

@WebSocketGateway()
export class ChatSalaGateway {
  constructor(private readonly chatSalaService: ChatSalaService) {}
}
