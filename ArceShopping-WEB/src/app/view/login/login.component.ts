import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  introducedPassword:string;
  userEmail:string;

  constructor(private firebaseService: FirebaseServiceService,
              private toast: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
  }

  async onSubmit(loginForm: NgForm){
    if(loginForm.valid){
      await this.firebaseService.login(this.userEmail, this.introducedPassword);
    }
  }

  handleResult(message:string){
    const code = message.split(':', 2);
    switch(code[0]){
      case '0':
        this.toast.success(message, 'Exito!');
        //redirect to home
        break;
      case '1':
        this.toast.warning(message, 'Atencion');
        break;
      case '2':
        this.toast.error(message, 'Error!');
        break;
    }  
  }
}
