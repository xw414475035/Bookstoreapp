import { Component, OnInit, TemplateRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { TitleService } from '../../services/title.service';
import { Cart } from '../../model/cart';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit {

  public cartList: Cart[];
  public totalPrice: Number;
  modalRef: BsModalRef;
  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private title: TitleService,
    private modalService: BsModalService) {
    this.loadCart();
  }

  ngOnInit() {
    this.title.setTitle('Checkout')
  }

  //get cart data when page load
  loadCart = () => {
    this.cartService.cartListSubject
      .subscribe(res => {
        this.cartList = res;
        this.calculateTotal(this.cartList);
      })
  };

  //remove cart item
  removeFromCart = index => {
    this.cartService.removeCart(index);
  };

  //change item quantity
  changeQuantity = (cart, quantity) => {
    cart.quantity = quantity;
    this.calculateTotal(this.cartList);
    localStorage.setItem('cartList', JSON.stringify(this.cartList));
  }

  //calculate total price
  calculateTotal(cartList) {
    let total = 0;
    for (let cart of cartList) {
      let singlePrice = 0;
      if (cart.product.saleInfo && cart.product.saleInfo.retailPrice && cart.product.saleInfo.retailPrice.amount) {
        singlePrice = cart.product.saleInfo.retailPrice.amount
      }
      total += singlePrice * cart.quantity;
    }
    this.totalPrice = total;
  }

  //checkout btn click
  checkout(template: TemplateRef<any>) {
    if (this.auth.isAuthenticated()) {
      //save to database
      //Show success overlay
      this.modalRef = this.modalService.show(template);
      //clean cartList
      this.cartService.emptyCart();
    } else {
      this.auth.login()
    }
  }

  //success overlay close
  returnShop() {
    this.modalRef.hide();
    this.modalRef = null;
    this.router.navigate(['']);
  }
}
