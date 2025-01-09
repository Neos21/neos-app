import { firstValueFrom } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileUploaderService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async findAll(): Promise<Array<string>> {
    return await firstValueFrom(this.httpClient.get<Array<string>>('/api/file-uploader/files'));
  }
  
  public async uploadFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('file_name', file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', '*/*');
    await firstValueFrom(this.httpClient.post('/api/file-uploader/files', formData, { headers }));
  }
  
  public async downloadFile(fileName: string): Promise<any> {
    return await firstValueFrom(this.httpClient.get(`/api/file-uploader/files/${fileName}`, { responseType: 'blob' }));
  }
  
  public async remove(fileName: string): Promise<boolean> {
    return await firstValueFrom(this.httpClient.delete('/api/file-uploader/files', { body: { file_name: fileName } })).then(_result => true).catch(_error => false);
  }
}
