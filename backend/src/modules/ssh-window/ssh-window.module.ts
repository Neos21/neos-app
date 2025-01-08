import { Module } from '@nestjs/common';

import { WebSocketSshGateway } from './web-socket-ssh.gateway';

@Module({
  providers: [
    WebSocketSshGateway
  ]
})
export class SshWindowModule { }
