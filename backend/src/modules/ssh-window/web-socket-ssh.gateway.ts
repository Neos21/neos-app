import * as fs from 'node:fs';
import * as path from 'node:path';
import { Server, Socket } from 'socket.io';
import { Client } from 'ssh2';

import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({  // 第1引数でポート番号を指定しないと NestJS のポート番号と統合される・コレにより express-list-endpoints がうまく開けなくなるが仕方ない
  cors: {
    origin: ['http://localhost:4200', 'https://app.neos21.net'], // 許可するオリジン
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class WebSocketSshGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  
  public handleConnection(client: Socket) {
    console.log(`Client Connected : ${client.id}`);
    
    client.on('ssh-start', name => {
      try {
        const ssh = new Client();
        ssh.on('ready', () => {
          client.emit('ssh-output', 'Connected To SSH Server\n');
          ssh.shell((error, stream) => {
            if(error) return client.disconnect();
            // WebSocket → SSH
            client.on('ssh-message', message => stream.write(message));
            // SSH → WebSocket
            stream.on('data', data => client.emit('ssh-output', data.toString()));
            // "exit"コマンドでSSH接続を終了
            stream.on('close', () => {
              client.emit('ssh-output', '\nConnection Closed\n');
              client.emit('ssh-clear'); // フロントエンドにクリア指示
              ssh.end();
            });
          });
        });
        
        const configFile = fs.readFileSync(path.resolve(__dirname, '../../../assets/ssh-config.json'), 'utf-8');
        const configJson = JSON.parse(configFile);
        const server     = configJson.find(server => server.name === name);
        if(server == null) throw new Error(`Invalid Server Name [${name}]`);
        
        ssh.connect({
          host      : server.host,
          port      : server.port,
          username  : server.user,
          privateKey: server.key
        });
        client.on('ssh-disconnect', () => ssh.end());
      }
      catch(error) {
        console.error('Failed To Connect : ', error);
        client.emit('ssh-error', 'Failed To Connect\n');
      }
    });
  }
  
  public handleDisconnect(client: Socket) {
    console.log(`Client Disconnected : ${client.id}`);
  }
}
