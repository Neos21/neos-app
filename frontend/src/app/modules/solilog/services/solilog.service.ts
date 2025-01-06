import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SolilogService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async getList(): Promise<Array<{ year: string; months: Array<string>; }>> {
    const rawYearMonths = await firstValueFrom(this.httpClient.get<Array<string>>('/api/solilog'));
    const yearMonths: Array<{ year: string; months: Array<string>; }> = [];
    rawYearMonths.forEach(yyyyMm => {  // 'YYYY-MM'
      const yyyy = yyyyMm.slice(0, 4);
      const mm   = yyyyMm.slice(-2);
      const targetYear = yearMonths.find(yearMonth => yearMonth.year === yyyy);
      if(targetYear == null) {
        yearMonths.push({ year: yyyy, months: [mm] });
      }
      else {
        targetYear.months.push(mm);
      }
    });
    // Sort Old Month To New Month
    yearMonths.forEach(yearMonth => yearMonth.months.sort((monthA, monthB) => monthA < monthB ? -1 : monthA > monthB ? 1 : 0));
    // Sort New Year To Old Year
    yearMonths.sort((yearMonthA, yearMonthB) => yearMonthA.year < yearMonthB.year ? 1 : yearMonthA.year > yearMonthB.year ? -1 : 0);
    return yearMonths;
  }
  
  public async getPosts(yearMonth: string | null): Promise<{ t: string; posts: Array<{ id: number; time: string; text: string; }>; }> {
    return await firstValueFrom(this.httpClient.get<{ t: string; posts: Array<{ id: number; time: string; text: string; }>; }>(`/api/solilog/posts?t=${yearMonth}`));
  }
  
  public async post(text: string): Promise<void> {
    return await firstValueFrom(this.httpClient.post<void>('/api/solilog/posts', { text }));
  }
  
  public async remove(yearMonth: string, id: number): Promise<void> {
    return await firstValueFrom(this.httpClient.delete<void>('/api/solilog/posts', { body: { t: yearMonth, id }}));
  }
  
  public async search(keyword: string): Promise<Array<{ time: string; text: string; }>> {
    return await firstValueFrom(this.httpClient.get<Array<{ time: string; text: string; }>>(`/api/solilog/search?q=${keyword}`));
  }
}
