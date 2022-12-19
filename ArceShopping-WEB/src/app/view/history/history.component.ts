import { Component, OnInit } from '@angular/core';
import { Purchase } from 'src/app/model/purchase.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userPurchases: Purchase[];
  constructor(private firebaseService: FirebaseServiceService) { }

  ngOnInit(): void {
    this.firebaseService.emitter.subscribe((message)=>{
      this.handleResults(message)
    });

    this.firebaseService.retrieveUserPurchases();    
  }

  handleResults(message: string){
    const code = message.split(';', 3);
    switch(code[0]){
      case '0':
        this.userPurchases = JSON.parse(code[1]) as Purchase[];
    }
    
  }

  setPurchase(index: number){
    localStorage.setItem('selectedPurchase',
                          JSON.stringify(this.userPurchases[index]));
  }
}
