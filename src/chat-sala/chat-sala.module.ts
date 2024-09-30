import { Module } from '@nestjs/common';
import { ChatSalaService } from './chat-sala.service';
import { ChatSalaGateway } from './chat-sala.gateway';

@Module({
  providers: [ChatSalaGateway, ChatSalaService],
})
export class ChatSalaModule {}
