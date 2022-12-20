import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-forgopassword',
  templateUrl: './forgopassword.component.html',
  styleUrls: ['./forgopassword.component.css']
})
export class ForgopasswordComponent implements OnInit {
  enteredEmail: string;
  firebaseSubscription: any;
  resetButton: HTMLButtonElement;

  constructor(private firebaseService: FirebaseServiceService,
              private toastr: ToastrService,
              private router: Router) { 
    this.enteredEmail = '';
    this.firebaseSubscription = this.firebaseService.emitter.subscribe((message)=>{   
      this.handleResult(message)
    });
  }

  ngOnInit(): void {
  
    this.resetButton = document.getElementById('reset') as HTMLButtonElement;
    this.resetButton.addEventListener('click',()=>{
      this.resetButton.disabled = true;
      this.firebaseService.sendTemporaryPassword(this.enteredEmail);
    })
  }

  ngOnDestroy(): void {
    this.firebaseSubscription.unsubscribe();
  }

  handleResult(message: string){
    const code = message.split(':', 3);
    switch(code[0]){
      case '0':
        this.toastr.warning('Si el correo introducido existe, recibirá un mensaje para restablecer su contraseña','Aviso');
        this.router.navigateByUrl('', {replaceUrl: true});
        break;
        case '1':
        this.toastr.error(code[1],'Error');
        this.resetButton.disabled = false;
        break;
    }
  }

}
