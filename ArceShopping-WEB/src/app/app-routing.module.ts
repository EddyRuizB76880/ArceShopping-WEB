import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {redirectLoggedInTo, redirectUnauthorizedTo, 
        canActivate} from '@angular/fire/auth-guard';
import { AppComponent } from './view/app.component';
import { RegisterComponent } from './view/register/register.component';
import { LoginComponent } from './view/login/login.component';
import { HomeComponent } from './view/home/home.component';
import { ProductComponent } from './view/product/product.component';
import { ProfileComponent } from './view/profile/profile.component'
import { PurchaseComponent } from './view/purchase/purchase.component';
import { AboutusComponent } from './view/aboutus/aboutus.component';
import { HistoryComponent } from './view/history/history.component';
import { CheckoutComponent } from './view/checkout/checkout.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome), 
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path:'home',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'product/:id',
    component: ProductComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'purchase',
    component: PurchaseComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'aboutus',
    component: AboutusComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'history',
    component: HistoryComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },
  {
    path:'checkout',
    component: CheckoutComponent,
    ...canActivate(redirectUnauthorizedToLogin), 
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
