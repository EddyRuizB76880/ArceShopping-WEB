import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Purchase } from 'src/app/model/purchase.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userPurchases: Purchase[];
  constructor(private firebaseService: FirebaseServiceService, 
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userPurchases = [];
    this.firebaseService.emitter.subscribe((message)=>{
      this.handleResults(message)
    });
    this.firebaseService.retrieveUserPurchases();    
  }

  handleResults(message: string){
    const code = message.split(';', 3);
    this.spinner.hide();
    switch(code[0]){
      case '0':
        this.userPurchases = JSON.parse(code[1]) as Purchase[];
      break;
    }
    
  }

  setPurchase(index: number){
    localStorage.setItem('selectedPurchase',
                          JSON.stringify(this.userPurchases[index]));
  }
}
