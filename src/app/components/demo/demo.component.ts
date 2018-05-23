import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  users: any = [];
  books: any = [];

  constructor(private api: ApiService, private title: TitleService) { }

  ngOnInit() {
    this.title.setTitle('Demo');
    this.api.getAllUsers().subscribe(users => {
      this.users = users;
    });

    this.api.getBooks().subscribe(books => {
      this.books = books.items;
    });
  }

}
