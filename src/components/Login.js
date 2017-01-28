import React from 'react';
import { login } from '../helpers/auth';


export default class Login extends React.Component  {

  handleSubmit = (e) => {
      e.preventDefault()
      login(this.email.value, this.pw.value)
  }
  render () {
    return (
      <div className="login__section">
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Email</label>
            <input ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          <input type="submit" className="login__btn" value="Login"></input>
        </form> 
      </div>
    )
  }
}