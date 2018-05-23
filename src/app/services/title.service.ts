import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(private title: Title) { }

  //change warriors title
  setTitle (subTitle: String) {
    this.title.setTitle(subTitle + ' | Warriors');
  }

}
