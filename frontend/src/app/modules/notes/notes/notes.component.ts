import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  standalone: false
})
export class NotesComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = true;
  /** エラー */
  public error?: Error | string;
  
  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.isProcessing = true;
    this.form = this.formBuilder.group({ text: [''] });
    try {
      const note = await this.notesService.findOne();
      this.form.setValue({ text: note?.text ?? '' });
    }
    catch(error: any) {
      this.error = error;
    }
    this.isProcessing = false;
  }
  
  public async save(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.notesService.save(this.form.value.text);
    }
    catch(error: any) {
      this.error = error;
    }
    this.isProcessing = false;
  }
}
