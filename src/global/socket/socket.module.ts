import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './gateway/gateway.socket';

@Global()
@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
