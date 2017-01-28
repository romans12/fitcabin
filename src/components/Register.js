import React from 'react';
import { auth } from '../helpers/auth';
import { ref, firebaseAuth } from '../config/constants'


const saveUserInfo = (name) => {
  firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        return ref.child(`users/${user.uid}/profile/`)
        .set({
          name: name
        })
        .then(() => user)
      } 
  })
}


export default class Register extends React.Component  {
  handleSubmit = (e) => {
    e.preventDefault();
    auth(this.email.value, this.pw.value)
    saveUserInfo(this.name.value)
  }
  render () {
    return (
      <div className="register__section">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Name</label>
            <input type="text" placeholder="Name" ref={(name) => this.name = name} />
          </div>
          <div>
            <label>Email</label>
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          <input type="submit" className="register__btn" value="Register"></input>
        </form>
      </div>
    )
  }
}