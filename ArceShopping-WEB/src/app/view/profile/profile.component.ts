import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:User;
  userDocId: string;
  firebaseSubscription: any;
  constructor(private firebaseService:FirebaseServiceService,
              private router: Router) 
  { 
    this.firebaseSubscription = this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  async loadUser(){
    await this.firebaseService.getUser();
  }

  handleResult(message: string){
    console.log(message)
    const code = message.split(';', 3)
    switch(code[0]){
      case '0':
        this.userDocId = code[1];
        this.user = JSON.parse(code[2]) as User;
        console.log(JSON.stringify(this.user));
    }
  }

  onSubmit(userInfo: NgForm){}
}
