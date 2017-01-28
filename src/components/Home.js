import React, { Component } from 'react'
import '../App.css';
import Content from '../components/Content';
import Header from '../components/Header';
import { Link, BrowserRouter, Match }  from 'react-router';
import Login from '../components/Login';
import Register from '../components/Register';

export default class Home extends Component {
  render () {
    return (
      <BrowserRouter>
      {({router}) => (
      <div>
        <Header />
        <Content>
          <div>
            <h1>Welcome to Fitcabin!</h1>
            <div className="login__link">
              <p><Link to="/login" className="login">Login</Link></p>
            </div>
            <div className="register__link">
              <p><Link to="/register" className="navbar-brand">Register</Link></p>
            </div>
          </div>
          <Match pattern="/login" component={Login} />
          <Match pattern="/register" component={Register} />
        </Content>
      </div>
      )}
      </BrowserRouter>
    )
  }
}