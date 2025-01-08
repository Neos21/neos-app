import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../../environments/environment';

@Injectable()
export class SshWindowService {
  private socket: Socket;
  
  constructor() {
    this.socket = io(environment.webSocketUrl);
  }
  
  public startSsh(name: string) {
    this.socket.emit('ssh-start', name);
  }
  
  public sendMessage(message: string) {
    this.socket.emit('ssh-message', message);
  }
  
  public onOutput(callback: (data: string) => void) {
    this.socket.on('ssh-output', callback);
  }
  
  public onError(callback: (data: string) => void) {
    this.socket.on('ssh-error', callback);
  }
  
  public onClear(callback: () => void) {
    this.socket.on('ssh-clear', callback);
  }
}
