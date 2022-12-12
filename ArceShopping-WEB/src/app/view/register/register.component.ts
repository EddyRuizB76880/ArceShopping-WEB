import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import { splitAtColon } from '@angular/compiler/src/util';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private firebaseService:FirebaseServiceService, 
              private router:Router,
              private toast:ToastrService) { }
  user: User = new User();

  ngOnInit(): void {
    this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
  }

  async onSubmit(newUserForm: NgForm) {
    console.log(`I received this:${newUserForm.valid}`);
    if(newUserForm.valid){
      await this.firebaseService.saveNewUser(this.user);
      await this.firebaseService.sendTemporaryPassword(this.user.email);      
    }
  }

  handleResult(message: string){
    const code = message.split(":",2);
    switch(code[0]){
      case "0":
        this.toast.warning(code[1], "Verificación requerida");
        this.router.navigateByUrl('/', {replaceUrl: true});
        break;

      case "1":
        this.toast.error(code[1],"Error");
        break;
      }
  }

}
