import { Component, OnInit } from '@angular/core';

import { FileUploaderService } from '../services/file-uploader.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  standalone: false
})
export class FileUploaderComponent implements OnInit {
  /** 読込中かどうか */
  public isLoading: boolean = true;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラー */
  public error?: Error | string;
  /** フォームをリセット中かどうか */
  public isResetting: boolean = false;
  /** アップロード済ファイル一覧 */
  public fileNames?: Array<string>;
  /** アップロード対象ファイル */
  private file: File | null = null;
  
  constructor(
    private fileUploaderService: FileUploaderService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    await this.findAll();
  }
  
  public async findAll(): Promise<void> {
    this.isLoading = true;
    this.error = undefined;
    try {
      this.fileNames = await this.fileUploaderService.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isLoading = false;
    }
  }
  
  public handleFileInput(event: Event): void | null {
    const files = (event?.target as any)?.files;
    this.file = (files == null || files.length === 0) ? null : files.item(0);
  }
  
  public async uploadFile(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.fileUploaderService.uploadFile(this.file!);  // Throws
      this.file = null;
      // Reset Form
      this.isResetting = true;
      window.setTimeout(() => {
        this.isResetting = false;
      }, 1);
      await this.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async downloadFile(fileName: string): Promise<void> {
    try {
      const blob = await this.fileUploaderService.downloadFile(fileName);
      const anchor = document.createElement('a');
      const objectUrl = window.URL.createObjectURL(blob);
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.click();
      window.URL.revokeObjectURL(objectUrl);
    }
    catch(error: any) {
      this.error = error;
    }
  }
  
  public async remove(fileName: string): Promise<void> {
    try {
      await this.fileUploaderService.remove(fileName);
      await this.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
  }
}
