import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  user: User = new User();
  firebaseSubscription: any;
  submitButton: HTMLButtonElement;
  
  //Through dependency injection, get the services required by the component.
  constructor(private firebaseService:FirebaseServiceService, 
              private router:Router,
              private toast:ToastrService) { }
 

  /*
    Angular's component's lifecycle method.
    It is invoked when a component has recently been created.
  */
  ngOnInit(): void {
    //Subscribe to service's event emitter, so component can react to its emit()
    this.firebaseSubscription= this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
    //Use DOM to retrieve button element defined on template
    this.submitButton = document.getElementById('submitButton') as HTMLButtonElement;
  }

  /*
    Angular's component's lifecycle method.
    It is invoked when a component is about to be destroyed.
  */
  ngOnDestroy(): void {
    //When this component is about to finish being used, unsubscribe to event emitter
    //to avoid memory leaks.
    this.firebaseSubscription.unsubscribe();
  }

  /*
    When user clicks on 'Submit', this method will be invoked
  */ 
  async onSubmit(newUserForm: NgForm) {
    //Check if form is valid according to rules we defined on template
    if(newUserForm.valid){
      //Disable button to avoid user spamming submit button
      this.submitButton.disabled = true;
      this.firebaseService.saveNewUser(this.user);    
    }else{
      //No field can be empty
      this.toast.warning('Todos los campos del formulario deben estar poblados','Aviso');
    }
  }

  /*
    This method is invoked when service's event emitter invokes its emit()
    method.
  */ 
  handleResult(message: string){
    //Every service returns a string in the following format:
    //number[special_character]message
    
    //Split message using the special character
    const code = message.split(":",2);

    //React according to message code
    switch(code[0]){
      case "0":
        //New user was successfully created, but they need to set a new password 
        //using a special link sent to their email.
        //Setting the password verifies email as well on firebase auth.
        this.toast.warning(code[1], "Verificación requerida");
        //Redirect user back to login screen.
        this.router.navigateByUrl('/', {replaceUrl: true});
        break;

      case "1":
        //Something went wrong with the new user's creation
        this.toast.error(code[1],"Error");
        //Enable submit button again. 
        this.submitButton.disabled = false;
        break;
      }
  }

}
