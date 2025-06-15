import { ConfigService } from '@nestjs/config';
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

@WebSocketGateway(8680, {
  cors: {
    origin: '*', // 실제 배포 시 origin 지정 필수
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly configService: ConfigService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`📡 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // ✅ 유저가 접속 시 방 참여
  @SubscribeMessage('join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    console.log('📥 join 이벤트 수신:', userId);
    console.log('💡 client id:', client.id);
    const room = `user_${userId}`;
    client.join(room);
    console.log(`🚪 User ${userId} joined room: ${room}`);
  }

  // ✅ 서비스에서 호출: 특정 유저에게 알림 전송
  sendNotificationToUser(
    userId: number,
    payload: { message: string; url: string; type: string },
  ) {
    const room = `user_${userId}`;
    this.server.to(room).emit('notification', payload);
    console.log(`📤 Notification sent to ${room}`, payload);
  }
}
