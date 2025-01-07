import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css'],
  standalone: false
})
export class WarningComponent {
  /** ワーニングメッセージ */
  @Input()
  public message?: string;
}
