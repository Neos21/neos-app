import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileUploaderService {
  constructor(
    private httpClient: HttpClient
  ) { }
  
  public async findAll(): Promise<Array<string>> {
    return await firstValueFrom(this.httpClient.get<Array<string>>('/api/file-uploader/files'));
  }
  
  public async uploadFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('fileName', file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', '*/*');
    await firstValueFrom(this.httpClient.post('/api/file-uploader/files', formData, { headers }));
  }
  
  public async downloadFile(fileName: string): Promise<any> {
    return await firstValueFrom(this.httpClient.get(`/api/file-uploader/files/${fileName}`, { responseType: 'blob' }));
  }
  
  public async remove(fileName: string): Promise<boolean> {
    return await firstValueFrom(this.httpClient.delete('/api/file-uploader/files', { body: { fileName } })).then(_result => true).catch(_error => false);
  }
}
