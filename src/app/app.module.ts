//system component import
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
//bootstrap component import
import { AppBootstrapModule } from './app-bootstrap.module';
//ROUTES component import
import { AppRoutesModule } from './app.routes';
//custom service import
import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api.service';
import { TitleService } from './services/title.service';
//custom component import
import { DemoComponent } from './components/demo/demo.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ErrorComponent } from './components/error/error.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartService } from './services/cart.service';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { QuantityControllerComponent } from './components/quantity-controller/quantity-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    CallbackComponent,
    ErrorComponent,
    ProductListComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
    HomeComponent,
    UserProfileComponent,
    CheckoutComponent,
    QuantityControllerComponent,
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    AppRoutesModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
  ],
  providers: [
    AuthService,
    ApiService,
    TitleService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
