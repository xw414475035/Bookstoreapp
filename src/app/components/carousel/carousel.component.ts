import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  myInterval = 3500;
  activeSlideIndex = 0;

  slides = [
    {image: 'assets/images/bg1.jpg'},
    {image: 'assets/images/bg2.jpg'},
    {image: 'assets/images/bg3.jpg'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
