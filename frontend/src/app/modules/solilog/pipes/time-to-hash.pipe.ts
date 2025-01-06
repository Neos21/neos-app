import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToHash',
  standalone: false
})
export class TimeToHashPipe implements PipeTransform {
  public transform(value: string): string {
    return `post-${value.replace(' ', '-').replace((/:/gu), '-')}`;
  }
}
