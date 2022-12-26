import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user.model';
import { CapacitorService } from 'src/app/services/capacitor.service';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  user:User;
  userDocId: string;// This attribute is needed to save updates on firebase
  firebaseSubscription: any;
  capacitorSubscription: any;
  profilePicture: HTMLImageElement; 
  userRetrieved: Boolean = false;

  constructor(private firebaseService: FirebaseServiceService,
              private spinner: NgxSpinnerService,
              private toast: ToastrService,
              private router: Router,
              private capacitorService: CapacitorService) 
  { 
    this.firebaseSubscription = this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });

    this.capacitorSubscription = this.capacitorService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.firebaseService.getUser();
  }

  ngOnDestroy():void{
    //Avoid memory leaks and unexpected behaviour 
    //by unsubscribing to both event emitters.
    this.firebaseSubscription.unsubscribe();
    this.capacitorSubscription.unsubscribe();
  }

  getHtmlElements(){
    this.profilePicture = document.getElementById('profilePic') as HTMLImageElement;
    if(this.user.picture !== ''){
      this.profilePicture.src = this.user.picture;
    }
    this.spinner.hide();
  }

  displayPictureOptions(){
    this.capacitorService.displayPictureOptions();
  }

  async logout(){
    await this.firebaseService.logout();
    this.router.navigateByUrl('',{replaceUrl:true});
   }
 

  handleResult(message: string){
    console.log(message)
    const code = message.split(';', 3)
    switch(code[0]){
      case '0':
        //User data was retrieved
        this.userRetrieved = true;
        this.userDocId = code[1];
        this.user = JSON.parse(code[2]) as User;
        
        setTimeout(()=>{
          this.getHtmlElements();
        },1000);
       
        break;
      case '1':
        //Data update was successful
        this.spinner.hide();
        this.toast.success(code[1], 'Exito');
      
        break;
      case '2':
        //Capacitor either took a picture or retrieved an image from gallery
        //and now is sending over the path to it.
        this.profilePicture.src = code[1];
        break
      case '3':
        //User invoked capacitor's service, but did not take a pic nor choose an image.
        this.toast.warning(code[2], 'Aviso');
        break
    }
  }

  

  onSubmit(userInfo: NgForm){
    //ToDO: Find  a way to determine which fields have been modified and only update those
    //with firebase service.
    if(userInfo.valid){
      this.spinner.show();
      this.firebaseService.updateUserDetails(this.user, this.userDocId, 
                                              this.profilePicture.src);
    }else{
      this.toast.error('Sus datos deben estar completos','Campos vacíos');
    }
  }
}
