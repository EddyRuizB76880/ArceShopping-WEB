import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './view/app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { RegisterComponent } from './view/register/register.component';
import { LoginComponent } from './view/login/login.component';
import { HomeComponent } from './view/home/home.component';
import { ProductComponent } from './view/product/product.component';
import { HeaderComponent } from './view/header/header.component';
import { ProfileComponent } from './view/profile/profile.component';
import { CheckoutComponent } from './view/checkout/checkout.component';
import { AboutusComponent } from './view/aboutus/aboutus.component';
import { HistoryComponent } from './view/history/history.component';
import { PurchaseComponent } from './view/purchase/purchase.component';
import { ForgopasswordComponent } from './view/forgopassword/forgopassword.component';
import { NgxSpinnerModule } from 'ngx-spinner';

interface NgxSpinnerConfig {
  type?: string;
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ProductComponent,
    HeaderComponent,
    ProfileComponent,
    CheckoutComponent,
    AboutusComponent,
    HistoryComponent,
    PurchaseComponent,
    ForgopasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule, // required by animations module
    ToastrModule.forRoot(), // ToastrModule added
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] //Required by capacitor/google maps
})
export class AppModule { }
