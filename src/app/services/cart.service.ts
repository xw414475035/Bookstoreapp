
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import 'rxjs/add/operator/map';
import { Cart } from "../model/cart";

@Injectable()
export class CartService {

    public cartListSubject = new BehaviorSubject([]);
    public toggleCartSubject = new BehaviorSubject(false);

    toggleCart = () => {
        this.toggleCartSubject.next(!this.toggleCartSubject.getValue());
    };

    //add item into cart
    addToCart = (cart: Cart) => {
        let current = this.cartListSubject.getValue();
        let dup = current.find( c=> 
            c.product.id === cart.product.id
        );
        if (dup) {
            dup.quantity += cart.quantity;
        } else {
            current.push(cart);
        }
        this.cartListSubject.next(current);
        localStorage.setItem('cartList', JSON.stringify(current));
    };

    //get cart data from local storage
    reloadCart = () => {
        let cartList = JSON.parse(localStorage.getItem('cartList'));
        if (cartList) {
            this.cartListSubject.next(cartList);
        }
    };

    //remove Cart item by index
    removeCart = index => {
        let current = this.cartListSubject.getValue();
        current.splice(index, 1);
        this.cartListSubject.next(current);
        localStorage.setItem('cartList', JSON.stringify(current));
    };

    emptyCart () {
        localStorage.removeItem('cartList');
        this.cartListSubject.next([]);
    }
}

