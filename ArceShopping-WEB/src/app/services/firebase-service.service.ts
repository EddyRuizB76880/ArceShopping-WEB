import {EventEmitter, Injectable, Query} from '@angular/core';

import { getStorage, ref, uploadBytes } from '@angular/fire/storage'
import {
  Auth, 
  updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

import {
  query, 
  collection, 
  where, 
  getDocs, 
  doc, 
  Firestore, 
  addDoc, 
  updateDoc
} from '@angular/fire/firestore';

import { Product } from '../model/product.model';
import { User } from '../model/user.model';
import { getDownloadURL } from 'firebase/storage';
import { ShoppingCartRow } from '../model/shoppingCartRow.model';


@Injectable({
  providedIn: 'root'
})

export class FirebaseServiceService {
  public emitter:EventEmitter<string>;
  private userEmail: string;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.emitter = new EventEmitter<string>();
    this.userEmail = this.auth.currentUser?.email as string;
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

  public async updateUserDetails(user:User, userDocId:any, newPictureString:string){
    const userDocReference = doc(this.firestore,'Users' , userDocId)
    const url = await this.saveImageInStorage(newPictureString);
    updateDoc(userDocReference,
      {
        name:user.name, id:user.id, email:user.email,
        age: user.age, province:user.location, picture:url
      }).then(()=>{
      this.emitter.emit('1;Cambios guardados');
    }); 
  }
  
  public async getUser(){
    const userQuery = query(collection(this.firestore,'Users'),
                      where('email','==', this.userEmail));

    await getDocs(userQuery).then((userDoc)=>{
      if(!userDoc.empty){
        const user = userDoc.docs[0].data() as User;
        //const userJsonString = user.toJsonString(); throws error user.toJsonString is not a function
        this.emitter.emit(`0;${userDoc.docs[0].id};${JSON.stringify(user)}`);
      }
    })
  }

  public async getUserShoppingCart(){
    
    const shoppingCartQuery = query(collection(this.firestore,'Shopping_cart'),
                              where('ownerEmail','==', this.userEmail));
    const shoppingCartItems = await getDocs(shoppingCartQuery);
    let shoppingCart: ShoppingCartRow[] = []

    if(!shoppingCartItems.empty){
    
      shoppingCartItems.docs.forEach((doc)=>{
          const shoppingCartItem = doc.data() as ShoppingCartRow;
          shoppingCart.push(shoppingCartItem);
      });
    }
   
    this.emitter.emit(`0;${JSON.stringify(shoppingCart)}`);
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

  public async saveImageInStorage(imageBlob: string){
    //A CORS error jumps if fetch tries to retrieve an url. TODO: Fix that.
    let blob:Blob = await fetch(imageBlob).then(response => response.blob());
    const firebaseStorage = getStorage();
    const imageRef = ref(firebaseStorage, this.userEmail);

    await uploadBytes(imageRef, blob);
    const pathToImage = getDownloadURL(imageRef);
    return pathToImage;
  }
}
