import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
  userDocId: string;
  firebaseSubscription: any;
  capacitorSubscription: any;
  profilePicture: HTMLImageElement; 
  constructor(private firebaseService: FirebaseServiceService,
              private router: Router,
              private toast: ToastrService,
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
    const setProfilePictureButton = document.getElementById('setProfilePicButton') as HTMLButtonElement;
    setProfilePictureButton.addEventListener('click',()=>{
        this.capacitorService.displayPictureOptions();
    });
    this.profilePicture = document.getElementById('profilePic') as HTMLImageElement;
    this.loadUser();
  }

  ngOnDestroy():void{
    this.firebaseSubscription.unsubscribe();
    this.capacitorSubscription.unsubscribe();
  }

  async loadUser(){
    await this.firebaseService.getUser();
    if(this.user.picture != ''){
      this.profilePicture.src = this.user.picture;
    }
  }

  handleResult(message: string){
    console.log(message)
    const code = message.split(';', 3)
    switch(code[0]){
      case '0':
        this.userDocId = code[1];
        this.user = JSON.parse(code[2]) as User;
        break;
      case '1':
        this.toast.success(code[1], 'Exito');
        break;
      case '2':
        this.profilePicture.src = code[1];
        break
      case '3':
        this.toast.warning(code[2], 'Aviso');
      break
    }
  }

  

  onSubmit(userInfo: NgForm){
    //ToDO: Find  a way to determine which fields have been modified and only update those
    //with firebase service.
    if(userInfo.valid){
      this.firebaseService.updateUserDetails(this.user, this.userDocId, 
                                              this.profilePicture.src);
    }else{
      this.toast.error('Sus datos deben estar completos','Campos vacíos');
    }
  }
}
