import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './components/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    ErrorComponent,
    LoadingComponent
  ],
  exports: [
    // Re-Export
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // Declarations
    ErrorComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
