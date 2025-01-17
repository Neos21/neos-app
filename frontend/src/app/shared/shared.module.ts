import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './components/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { WarningComponent } from './components/warning/warning.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    ReactiveFormsModule,
    // Declarations
    ErrorComponent,
    LoadingComponent,
    WarningComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class SharedModule { }
