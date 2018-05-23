import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  display: Boolean = true

  constructor(
    private auth: AuthService,
    private title: TitleService) { }

  ngOnInit() {
    this.title.setTitle('Profile')
  }

  //toggle btn to open/close update user info
  ChangeUSerPro = () => {
    this.display = !this.display;
  };

  //save user data to database
  SaveUserPro = () => {
    const name = (<HTMLInputElement>document.getElementById('js_name')).value;
    const phone = (<HTMLInputElement>document.getElementById('js_phone')).value;
    const address = (<HTMLInputElement>document.getElementById('js_address')).value;
    const userInfo = {
      name: name,
      phone: phone,
      address: address
    };
    this.auth.updateUser(userInfo);
    this.display = !this.display;
  };
}
