import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './components/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { WarningComponent } from './components/warning/warning.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    ErrorComponent,
    LoadingComponent,
    WarningComponent
  ],
  exports: [
    // Re-Export
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // Declarations
    ErrorComponent,
    LoadingComponent,
    WarningComponent
  ]
})
export class SharedModule { }
