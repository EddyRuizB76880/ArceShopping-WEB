import {EventEmitter, Injectable} from '@angular/core';
import { User } from '../model/user.model';

import {
  Auth, updatePassword,
  user,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut} 
from '@angular/fire/auth';

import {query, collection, where, 
        getDocs, doc, Firestore, addDoc, updateDoc} 
from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  public emitter:EventEmitter<string>;
  constructor(private auth: Auth, private firestore: Firestore) {
    this.emitter = new EventEmitter<string>();
  }

  public async saveNewUser(newUser:User){
    //NOTE: the password "holis" must be changed to a randomly generated string
    await createUserWithEmailAndPassword(this.auth, newUser.email, "holppoois")
    .then(()=>{
      addDoc(collection(this.firestore,"Users"),
      {name:newUser.name, id:newUser.id, email:newUser.email,
      age: newUser.age, province:newUser.location, pic:"", 
      passwordChanged: false});
      signOut(this.auth);
    }).catch((error)=>{
      console.log(error.message);
      this.emitter.emit("1:El correo electrónico ya está registrado");
    })
    
  }

  public updateUserDetails(){}
  public getUser(){}

  public sendTemporaryPassword(email:string){
    sendPasswordResetEmail(this.auth, email)
    .then(() => {
      this.emitter.emit("0:Revise su correo y establezca una contraseña");
    })
  }

  async login(email:string, password:string){
    await signInWithEmailAndPassword(this.auth, email, password).then(
    (response)=>{
    if(response.user){
      if(response.user.emailVerified){
        this.emitter.emit("0: Inicio de sesión exitoso");
      }else{
        this.emitter.emit("1: Verifique su correo.");
      }
    }
  }).catch((error)=>{
    console.log(error);
    this.emitter.emit("2: Credenciales incorrectas");
  })
    
  }

  public logout(){}  
}
