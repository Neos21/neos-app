import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Terminal } from '@xterm/xterm';

import { SshWindowService } from '../services/ssh-window.service';

@Component({
  selector: 'app-ssh-window',
  templateUrl: './ssh-window.component.html',
  styleUrls: ['./ssh-window.component.css'],
  standalone: false
})
export class SshWindowComponent implements OnInit {
  /** フォーム */
  public form!: FormGroup;
  /** 接続中かどうか */
  public isConnecting: boolean = false;
  /** ターミナル */
  private terminal!: Terminal;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sshWindowService: SshWindowService
  ) { }
  
  public ngOnInit() {
    this.form = this.formBuilder.group({ name: ['', [Validators.required]] });
    
    this.terminal = new Terminal();
    this.terminal.open(document.getElementById('ssh-window')!);
    
    // WebSocket のデータをターミナルに表示する
    this.sshWindowService.onOutput(data => this.terminal.write(data));
    // ターミナルの入力を WebSocket に送信する
    this.terminal.onData(data => this.sshWindowService.sendMessage(data));
    
    // WebSocket のデータをターミナルに表示する (エラーメッセージ)
    this.sshWindowService.onError(data => {
      this.terminal.clear();
      this.terminal.write(data);
      this.isConnecting = false;
    });
    // サーバーからのクリア指示を受け取りターミナルをクリアする
    this.sshWindowService.onClear(() => {
      this.terminal.clear();
      this.isConnecting = false;
    });
  }
  
  public startSsh(): void {
    this.terminal.clear();  // 新しい接続前にターミナルをクリアする
    this.sshWindowService.startSsh(this.form.value.name);
    this.isConnecting = true;
  }
}
