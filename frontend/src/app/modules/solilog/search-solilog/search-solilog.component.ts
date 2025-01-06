import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SolilogService } from '../services/solilog.service';

@Component({
  selector: 'app-search-solilog',
  templateUrl: './search-solilog.component.html',
  styleUrls: ['./search-solilog.component.css'],
  standalone: false
})
export class SearchSolilogComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラー */
  public error?: Error | string;
  /** Posts */
  public posts?: Array<{ time: string; text: string; }>;
  
  constructor(
    private formBuilder: FormBuilder,
    private solilogService: SolilogService
  ) { }
  
  public ngOnInit(): void {
    this.form = this.formBuilder.group({ keyword: ['', [Validators.required]] });
  }
  
  public async search(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    this.posts = undefined;
    try {
      this.posts = await this.solilogService.search(this.form.value.keyword);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
}
