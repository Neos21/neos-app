import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Note } from '../classes/note';
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
  /** ノートの ID の配列 */
  public notes: Array<Note> = [];
  /** エラー */
  public error?: Error | string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly notesService: NotesService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.isProcessing = true;
    this.form = this.formBuilder.group({
      id  : [''],
      text: ['']
    });
    try {
      this.notes = await this.notesService.findAll();
      await this.onOpen(this.notes[0].id);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async onOpen(id: number): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      const note = await this.notesService.findOne(id);
      this.form.setValue({
        id  : note.id,
        text: note.text
      });
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async create(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      const createdNote = await this.notesService.create();
      this.notes = [...this.notes, createdNote];
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async save(): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.notesService.save(Number(this.form.value.id), this.form.value.text);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async remove(id: string): Promise<void> {
    this.isProcessing = true;
    this.error = undefined;
    try {
      await this.notesService.remove(Number(id));
      const targetIndex = this.notes.findIndex(note => note.id === Number(id));
      this.notes.splice(targetIndex, 1);
      await this.onOpen(this.notes[0].id);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
}
