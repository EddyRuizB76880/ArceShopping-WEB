import { EventEmitter, Injectable } from '@angular/core';
import { Time } from '@angular/common'

import { 
  getStorage, 
  ref, 
  uploadBytes,
  getDownloadURL
 } from '@angular/fire/storage'

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
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

import { Product } from '../model/product.model';
import { User } from '../model/user.model';
import { ShoppingCartRow } from '../model/shoppingCartRow.model';
import { Purchase } from '../model/purchase.model';



@Injectable({
  providedIn: 'root'
})

export class FirebaseServiceService {
  public emitter:EventEmitter<string>;
  private userEmail: string;
  private USER_COLLECTION: string = 'Users';
  private SHOPPING_CART_COLLECTION: string = 'Shopping_cart'
  private PURCHASE_COLLECTION: string = 'Purchase';

  constructor(private auth: Auth, private firestore: Firestore) {
    this.emitter = new EventEmitter<string>();
    this.userEmail = this.auth.currentUser?.email as string;
  }

  public async saveNewUser(newUser:User){
    //ToDo: the password "holis" must be changed to a randomly generated string
    await createUserWithEmailAndPassword(this.auth, newUser.email, "holppoois")
    .then(()=>{
      addDoc(collection(this.firestore, this.USER_COLLECTION),
      {name:newUser.name, id:newUser.id, email:newUser.email,
      age: newUser.age, location:newUser.location, picture:""});
      signOut(this.auth);
      this.sendTemporaryPassword(newUser.email);
    }).catch((error)=>{
      console.log(error.message);
      this.emitter.emit('1:El correo electrónico ya está registrado');
    })
    
  }


  public async sendTemporaryPassword(email:string){
    let result: string = '';

    await sendPasswordResetEmail(this.auth, email)
    .then(() => {
      result = '0:Revise su correo y establezca una contraseña';
    }).catch((error) =>{ 
      result = '1:Correo no válido'
    })

    this.emitter.emit(result);
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

  public async updateUserDetails(user:User, userDocId:any, newPictureString:string){
    const userDocReference = doc(this.firestore,this.USER_COLLECTION , userDocId)
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
    const userQuery = query(collection(this.firestore, this.USER_COLLECTION),
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
    
    const shoppingCartQuery = query(collection(this.firestore, this.SHOPPING_CART_COLLECTION),
                              where('ownerEmail','==', this.userEmail));
    const shoppingCartItems = await getDocs(shoppingCartQuery);
    let shoppingCartArray: ShoppingCartRow[] = []

    if(!shoppingCartItems.empty){
    
      shoppingCartItems.docs.forEach((doc)=>{
          let shoppingCartItem = doc.data() as ShoppingCartRow;
          shoppingCartItem.firebaseDocId = doc.id;
          shoppingCartArray.push(shoppingCartItem);
      });
    }
   
    this.emitter.emit(`0;${JSON.stringify(shoppingCartArray)}`);
  }


  public async insertToShoppingCart(product:Product, requestedQuantity:number){
    await addDoc(collection(this.firestore,'Shopping_cart'),
    { 
      ownerEmail: this.auth.currentUser?.email, 
      productId: product.id, 
      quantity: requestedQuantity,
      unitPrice: product.price,
    }).then(()=>{
        this.emitter.emit("0:Producto añadido exitosamente");
    }).catch((error)=>{
        this.emitter.emit("1:Ocurrió un error");
    });

  
  }

  public deleteFromShoppingCart(documentId: string){
    const documentReference = doc(this.firestore, 'Shopping_cart', documentId);
    deleteDoc(documentReference);
  }

  public async confirmPurchase(shoppingCartArray: ShoppingCartRow[], 
                               purchaseTotal: number){
    let result: string = '1; El carrito está vacío';
    if(shoppingCartArray.length > 0){


      await addDoc(collection(this.firestore, this.PURCHASE_COLLECTION),
      { 
        purchaseShoppingCart: JSON.stringify(shoppingCartArray), 
        total: purchaseTotal, 
        purchaseTime: Date.now().toString(),
        ownerEmail: this.userEmail 
      }).then(()=>{ result = '2; Compra procesada!'});
    
    }
    this.emitter.emit(result);
  }

  public async retrieveUserPurchases(){
    let userPurchases: Purchase[] = [];

    const purchasesQuery = query(collection(this.firestore,this.PURCHASE_COLLECTION),
                           where('ownerEmail', '==' , this.userEmail));
    const purchaseDocs = await getDocs(purchasesQuery);
    
    if(!purchaseDocs.empty){
      purchaseDocs.docs.forEach((doc)=>{ userPurchases.push(doc.data() as Purchase) });
    }

    this.emitter.emit(`0;${JSON.stringify(userPurchases)}`);
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
