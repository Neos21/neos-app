import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Imports
import { CoreModule } from './core/core.module';
import { PagesModule } from './modules/pages.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
// Bootstrap
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    PagesModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
