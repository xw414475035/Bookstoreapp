import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Cart } from '../../model/cart';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public collapse: boolean = false;
  public cartList: Cart[];

  constructor(public auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartService.reloadCart();
    this.cartService.cartListSubject
      .subscribe(res => {
        this.cartList = res;
      })
  }

  //search function
  OnSearch(searchName) {
    if (searchName) {
      this.router.navigate([`/search/${searchName}`]);
    }
  }

  toggleCartPopup = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.toggleCart()
  }


}
