import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    BsDropdownModule,
    TooltipModule,
    ModalModule,
    CarouselModule
  ]
})
export class AppBootstrapModule {}