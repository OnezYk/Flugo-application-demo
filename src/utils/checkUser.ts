// Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {auth} from './db'
import { FirebaseError } from "firebase/app";

export const loginUser = async (email:string, password:string) => {
  
  try {
    await signInWithEmailAndPassword(auth, email, password)
    console.log("Login efetuado!");
    return true;
  } catch (err) {

    if (err instanceof FirebaseError && err.code == 'auth/invalid-credential') {
      alert("Usuário não encontrado!")
    } else {console.log(err)}

    return false;

  }

}

export const registerUser = async (email:string, password:string ) => {

  try {

    await createUserWithEmailAndPassword(auth, email, password)
    console.log("Registro efetuado!");
    return true;

  } catch (err) {

    if (err instanceof FirebaseError && err.code == 'auth/email-already-in-use') {
      alert("Usuário já registrado!")
    } else {console.log(err)}
    return false;
  }

}

export const signWith = async (type : string) => {

  try {

    const provider = type === 'google'? new GoogleAuthProvider() : new FacebookAuthProvider()
    await signInWithPopup(auth, provider);
    return true;

  } catch (err) {

    console.log(err)
    return false
  }

}

