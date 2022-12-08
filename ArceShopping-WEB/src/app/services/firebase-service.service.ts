import {EventEmitter, Injectable} from '@angular/core';

import {
  Auth, updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut} 
from '@angular/fire/auth';

import {query, collection, where, 
        getDocs, doc,Firestore, updateDoc} 
from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  public async test(){
    //5GMSOifzfnMFO3yjYXb1 
    const alertRef = doc(this.firestore, 'Users', '5GMSOifzfnMFO3yjYXb1');
    console.log("Creado");
    await updateDoc(alertRef, {
      resultado: 'Conexión funciona'
    });
    console.log("Actualizado"); 
  }
}
