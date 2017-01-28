import { ref, firebaseAuth } from '../config/constants'

//import Rebase from 're-base';

// let base = Rebase.createClass({
//    apiKey: "AIzaSyDhi_mVaQj9iHXIJmFryRh_nM82Sifsh2w",
//    authDomain: "testingnext-e225d.firebaseapp.com",
//    databaseURL: "https://testingnext-e225d.firebaseio.com/",
//    storageBucket: "testingnext-e225d.appspot.com",
//    messagingSenderId: "676839825448"
// });

export function auth (email, pw, name) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
    .catch((error) => console.log('Oops', error))
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function saveUser (user) {

  return ref.child(`users/${user.uid}/`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)

}
