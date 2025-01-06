import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeToYearMonth' })
export class TimeToYearMonthPipe implements PipeTransform {
  public transform(value: string): string {
    return value.slice(0, 7);
  }
}
