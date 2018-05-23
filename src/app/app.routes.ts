import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Route guards
import { AuthGuard } from './services/auth/auth.guard';
import { AdminGuard } from './services/auth/admin.guard';
// Page components
import { CallbackComponent } from './components/callback/callback.component';
import { DemoComponent } from './components/demo/demo.component';
import { ErrorComponent } from './components/error/error.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'demo',component: DemoComponent, canActivate: [ AuthGuard ] },
  { path: 'search/:search', component: ProductListComponent },
  { path: 'myprofile',component: UserProfileComponent, canActivate: [ AuthGuard ] },
  { path: 'checkout', component: CheckoutComponent},
  //this path should keep on bottom, add path above this comment!
  { path: 'error',component: ErrorComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  providers: [
    AuthGuard,
    AdminGuard
  ],
  exports: [RouterModule]
})
export class AppRoutesModule { }