import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {redirectLoggedInTo, redirectUnauthorizedTo, canActivate} from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
