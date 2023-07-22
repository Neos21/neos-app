import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'urlToAnchor' })
export class UrlToAnchorPipe implements PipeTransform {
  public transform(value: string): string {
    return value
      .replace((/\n/gu), '<br>')
      .replace((/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/igu), '<a href="$1" target="_blank" class="solilog-anchor">$1</a>');
  }
}
