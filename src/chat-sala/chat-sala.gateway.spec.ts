import { Test, TestingModule } from '@nestjs/testing';
import { ChatSalaGateway } from './chat-sala.gateway';
import { ChatSalaService } from './chat-sala.service';

describe('ChatSalaGateway', () => {
  let gateway: ChatSalaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSalaGateway, ChatSalaService],
    }).compile();

    gateway = module.get<ChatSalaGateway>(ChatSalaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
