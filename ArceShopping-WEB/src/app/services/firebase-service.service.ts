import {EventEmitter, Injectable, Query} from '@angular/core';
import { User } from '../model/user.model';

import {
  Auth, updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut} 
from '@angular/fire/auth';

import {query, collection, where, 
        getDocs, doc, Firestore, addDoc, updateDoc} 
from '@angular/fire/firestore';
import { Product } from '../model/product.model';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirebaseServiceService {
  public emitter:EventEmitter<string>;
  constructor(private auth: Auth, private firestore: Firestore) {
    this.emitter = new EventEmitter<string>();
  }

  public async saveNewUser(newUser:User){
    //ToDo: the password "holis" must be changed to a randomly generated string
    await createUserWithEmailAndPassword(this.auth, newUser.email, "holppoois")
    .then(()=>{
      addDoc(collection(this.firestore,'Users'),
      {name:newUser.name, id:newUser.id, email:newUser.email,
      age: newUser.age, province:newUser.location, pic:"", 
      passwordChanged: false});
      signOut(this.auth);
    }).catch((error)=>{
      console.log(error.message);
      this.emitter.emit('1:El correo electrónico ya está registrado');
    })
    
  }

  public updateUserDetails(user:User, userDocId:any, newPictureString:string){
    const userDocReference = doc(this.firestore,'Users' , userDocId)
    updateDoc(userDocReference,
      {
        name:user.name, id:user.id, email:user.email,
        age: user.age, province:user.location, pic:newPictureString
      }).then(()=>{
      this.emitter.emit('1;Cambios guardados');
    }); 
  }
  
  public async getUser(){
    const userEmail=this.auth.currentUser?.email;

    const userQuery = query(collection(this.firestore,'Users'),
                      where('email','==', userEmail));

    await getDocs(userQuery).then((userDoc)=>{
      if(!userDoc.empty){
        const user = userDoc.docs[0].data() as User;
        //const userJsonString = user.toJsonString(); throws error user.toJsonString is not a function
        this.emitter.emit(`0;${userDoc.docs[0].id};${JSON.stringify(user)}`);
      }
    })
    
  }

  public sendTemporaryPassword(email:string){
    sendPasswordResetEmail(this.auth, email)
    .then(() => {
      this.emitter.emit('0:Revise su correo y establezca una contraseña');
    })
  }

  async login(email:string, password:string){
    await signInWithEmailAndPassword(this.auth, email, password).then(
    (response)=>{
    if(response.user){
      if(response.user.emailVerified){
        this.emitter.emit('0: Inicio de sesión exitoso');
      }else{
        this.emitter.emit('1: Verifique su correo.');
      }
    }
  }).catch((error)=>{
    console.log(error);
    this.emitter.emit('2: Credenciales incorrectas');
  })
    
  }

  public async logout(){
    await signOut(this.auth);
  }  

  public async insertToShoppingCart(product:Product, requestedQuantity:number){
    await addDoc(collection(this.firestore,'Shopping_cart'),
    { 
      ownerEmail: this.auth.currentUser?.email, 
      productId: product.id, 
      quantity: requestedQuantity,
      price: requestedQuantity*product.price,
    }).then(()=>{
        this.emitter.emit("0:Producto añadido exitosamente");
    }).catch((error)=>{
        this.emitter.emit("1:Ocurrió un error");
    });
  }
}
