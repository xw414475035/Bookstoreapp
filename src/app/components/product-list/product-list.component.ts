import { Component, OnInit,TemplateRef  } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TitleService } from '../../services/title.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
    modalRef: BsModalRef;
    modalRef2: BsModalRef
    //this products controls display data
    products: any = [];
    //make a copy of full products
    catchesProducts: any = [];

    constructor(
        private cartService: CartService,
        private router: Router,
        private api: ApiService,
        private routeParams: ActivatedRoute,
        private title: TitleService,
        private modalService: BsModalService
    ) { }

    ngOnInit() {
        this.routeParams.params.subscribe(params => {
            let search = params['search'];
            if (search) {
                this.title.setTitle('Search');
                this.load(search);
            } else {
                this.load();
            }
        });
    }

    //open book detail modal
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    //close success modal
    closeFirstModal() {
        this.modalRef2.hide();
        this.modalRef2 = null;
    }

    //get books from google api
    load = (search?) => {
        this.api.getBooks(search).subscribe(products => {
            this.products = products.items;
            this.catchesProducts = products.items;
        });
    };

    //add books to cart
    addToCart = (product, template?: TemplateRef<any>) => {
        this.cartService.addToCart({ product, quantity: 1 })
        // more code to add to put this into cart
        if (template) { this.modalRef2 = this.modalService.show(template, { class: 'second' }); }
        if (this.modalRef) {
            this.modalRef.hide();
            this.modalRef = null;
        }
    };

    //sort books by name
    sortByName = () => {
        this.products.sort(function (a, b) {
            if (a.volumeInfo.title < b.volumeInfo.title) {
                return -1;
            } else if (a.volumeInfo.title > b.volumeInfo.title) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    //sort books by price high to low
    sortPriceHtoL = () => {
        this.products.sort(function (a, b) {
            let priceA = 0;
            let priceB = 0;
            if (a.saleInfo && a.saleInfo.retailPrice && a.saleInfo.retailPrice.amount) {
                priceA = a.saleInfo.retailPrice.amount;
            }
            if (b.saleInfo && b.saleInfo.retailPrice && b.saleInfo.retailPrice.amount) {
                priceB = b.saleInfo.retailPrice.amount;
            }
            if (priceA < priceB) {
                return 1;
            } else if (priceA > priceB) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    //sort books by price low to high
    sortPriceLtoH = () => {
        this.products.sort(function (a, b) {
            let priceA = 0;
            let priceB = 0;
            if (a.saleInfo && a.saleInfo.retailPrice && a.saleInfo.retailPrice.amount) {
                priceA = a.saleInfo.retailPrice.amount;
            }
            if (b.saleInfo && b.saleInfo.retailPrice && b.saleInfo.retailPrice.amount) {
                priceB = b.saleInfo.retailPrice.amount;
            }
            if (priceA < priceB) {
                return -1;
            } else if (priceA > priceB) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    //get for sales books
    filterForSale() {
        this.products = this.products.filter(prod => {
            return prod.saleInfo.saleability !== 'NOT_FOR_SALE';
        });
    }

    //get not for sales books
    filterNotForSale() {
        this.products = this.products.filter(prod => {
            return prod.saleInfo.saleability === 'NOT_FOR_SALE';
        });
    }

    //get books which amount greater than 30.00
    filterLarger() {
        this.products = this.products.filter(prod => {
            if (prod.saleInfo && prod.saleInfo.retailPrice && prod.saleInfo.retailPrice.amount) {
                return prod.saleInfo.retailPrice.amount >= 30.00;
            }
        });
    }

    //get books which amount lower than 30.00
    filterSmall() {
        this.products = this.products.filter(prod => {
            if ((prod.saleInfo && prod.saleInfo.retailPrice && prod.saleInfo.retailPrice.amount && prod.saleInfo.retailPrice.amount < 30.00) || prod.saleInfo.saleability === 'NOT_FOR_SALE') {
                return prod;
            }
        });
    }

    //show all books
    showAll() {
        this.products = this.catchesProducts;
    }
}
