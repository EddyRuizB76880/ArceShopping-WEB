import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private firebaseService:FirebaseServiceService,
              private router: Router) { }

  ngOnInit(): void {
  
  }

  async logout(){
   await this.firebaseService.logout();
   this.router.navigateByUrl('',{replaceUrl:true});
  }


}
