import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BookmarksService } from '../services/bookmarks.service';
import { Bookmark } from '../classes/bookmark';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
  standalone: false
})
export class BookmarksComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラー */
  public error?: Error | string;
  /** ブックマーク一覧 */
  public bookmarks?: Array<Bookmark>;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly bookmarksService: BookmarksService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({ url: ['', [Validators.required]] });
    await this.findAll();
  }
  
  public async findAll(): Promise<void> {
    try {
      this.bookmarks = await this.bookmarksService.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
  }
  
  public async create(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.bookmarksService.create(this.form.value.url);
      this.form.reset();
      await this.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
    this.isProcessing = false;
  }
  
  public async remove(id: number): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.bookmarksService.remove(id);
      await this.findAll();
    }
    catch(error: any) {
      this.error = error;
    }
    this.isProcessing = false;
  }
}
