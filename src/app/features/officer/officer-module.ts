import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficerRoutingModule } from './officer-routing-module';

// Components are standalone, so we don't need to declare them here.
// But we keep the module for Routing and shared imports if needed.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OfficerRoutingModule
  ]
})
export class OfficerModule { }
