import { Component } from '@angular/core';
import { HostListener } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ArceShopping-WEB';
  //This code forces the application to refresh a previously loaded page
  //when pressing back on the browser.
  //Taken from: https://stackoverflow.com/questions/66962638/force-angular-component-to-reload-on-back-button-press
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    location.reload()
  }
  constructor(){}

  ngOnInit():void {
    
  }
}
