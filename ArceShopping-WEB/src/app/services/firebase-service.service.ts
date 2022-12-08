import {EventEmitter, Injectable} from '@angular/core';

import {
  Auth, updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut} 
from '@angular/fire/auth';

import {query, collection, where, 
        getDocs, doc, Firestore, setDoc, updateDoc} 
from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  public saveNewUser(){}
  public updateUserDetails(){}
  public getUser(){}

  public resetPassword(){}
  public sendTemporaryPassword(){}
  public login(){}
  public logout(){}  
}
