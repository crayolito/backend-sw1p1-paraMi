import { Module } from '@nestjs/common';
import MessagesWsGateway from './messages-ws.gateway';
import { MessagesWsService } from './messages-ws.service';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
})
export class MessagesWsModule {}
