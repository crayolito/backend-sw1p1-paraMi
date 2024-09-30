import { Test, TestingModule } from '@nestjs/testing';
import { ChatSalaService } from './chat-sala.service';

describe('ChatSalaService', () => {
  let service: ChatSalaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSalaService],
    }).compile();

    service = module.get<ChatSalaService>(ChatSalaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
