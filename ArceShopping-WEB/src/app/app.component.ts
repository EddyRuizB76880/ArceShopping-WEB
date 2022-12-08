import { Component } from '@angular/core';
import { FirebaseServiceService } from './services/firebase-service.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ArceShopping-WEB';

  constructor(private firebaseService:FirebaseServiceService){}

  ngOnInit():void {
    this.firebaseService.test();
  }
}
