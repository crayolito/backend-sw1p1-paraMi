import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatSalaModule } from './chat-sala/chat-sala.module';
import { CommonModule } from './common/common.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { SalasModule } from './salas/salas.module';
import { UsersModule } from './users/users.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MessagesWsModule,
    ChatSalaModule,
    UsersModule,
    SalasModule,
    CommonModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
