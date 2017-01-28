import Rebase from 're-base'


var base = Rebase.createClass({
    apiKey: "AIzaSyDhi_mVaQj9iHXIJmFryRh_nM82Sifsh2w",
    authDomain: "testingnext-e225d.firebaseapp.com",
    databaseURL: "https://testingnext-e225d.firebaseio.com",
    storageBucket: "testingnext-e225d.appspot.com",
    messagingSenderId: "676839825448"
});


export const ref = base.database().ref();
export const storageRef = base.storage().ref();
export const firebaseAuth = base.auth;
