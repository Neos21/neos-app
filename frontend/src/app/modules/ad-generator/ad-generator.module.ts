import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AdGeneratorRoutingModule } from './ad-generator-routing.module';
import { AdGeneratorComponent } from './ad-generator/ad-generator.component';
import { AdGeneratorService } from './services/ad-generator.service';

@NgModule({
  imports: [
    SharedModule,
    AdGeneratorRoutingModule
  ],
  declarations: [
    AdGeneratorComponent
  ],
  providers: [
    AdGeneratorService
  ]
})
export class AdGeneratorModule { }
