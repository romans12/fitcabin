import React from 'react';
import './App.css';
import Content from './components/Content';
import Header from './components/Header';
import AddActivity from './components/AddActivity';
import List from './components/List';
import Home from './components/Home';
import { firebaseAuth } from './config/constants'
import Rebase from 're-base'
import { Match, BrowserRouter, Link, Miss, Redirect }  from 'react-router';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

let base = Rebase.createClass({
    apiKey: "AIzaSyDhi_mVaQj9iHXIJmFryRh_nM82Sifsh2w",
    authDomain: "testingnext-e225d.firebaseapp.com",
    databaseURL: "https://testingnext-e225d.firebaseio.com/",
    storageBucket: "testingnext-e225d.appspot.com",
    messagingSenderId: "676839825448"
});



function MatchWhenAuthed ({component: Component, authed, ...rest}) {
  return (
    <Match
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function MatchWhenUnauthed ({component: Component, authed, ...rest}) {
  return (
    <Match
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}


export default class App extends React.Component  {
  constructor(props){
    super(props);
    this.state = {
      list: [],
      loading: true,
      authed: false
    }
  }

  componentDidMount(){
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.ref = base.syncState(`/activities/${user.uid}/`, {
          context: this, 
          state: 'list',
          asArray: true,
          queries: {
            orderByChild: 'sortDate'
          }, 
          then(){
            this.setState({
              authed: true,
              loading: false,
            })
          }
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
    this.removeListener()
  }
  handleAddItem(newItem){

    this.setState({
      list: this.state.list.concat([newItem])
    })
    
  }
  handleRemoveItem(index){
    var newList = this.state.list;
    newList.splice(index, 1);
    this.setState({
      list: newList
    })
  }


  render() { 
    return this.state.authed === false ? <Home /> : (
      <BrowserRouter>
        {({router}) => (
          <div className="App">
              <Header>
                  <nav className="navbar navbar-default navbar-static-top">
                      <ul className="nav navbar-nav pull-right">
                        <li>
                          {this.state.authed
                            ? <button
                                onClick={() => {
                                  base.unauth()
                                  this.setState({authed: false})
                                  router.transitionTo('/')
                                }}
                                className="navbar-brand">Logout</button>
                            : <span>
                                <Link to="/login" className="login">Login</Link>
                                <Link to="/register" className="navbar-brand">Register</Link>
                              </span>}
                        </li>
                      </ul>
                  </nav>
              </Header>
              <Content>
                  <div className="row">
                    <Match pattern='/' exactly component={Content} />
                    <MatchWhenUnauthed authed={this.state.authed} pattern='/login' component={Login} />
                    <MatchWhenUnauthed authed={this.state.authed} pattern='/register' component={Register} />
                    <MatchWhenAuthed authed={this.state.authed} pattern='/dashboard' component={Dashboard} />
                    <Miss render={() => <h3>No Match</h3>} />
                  </div>
              <AddActivity add={this.handleAddItem.bind(this)}/>
              {this.state.loading === true ? <h3> LOADING... </h3> : 
                <List items={this.state.list} remove={this.handleRemoveItem.bind(this)}
              />
              }
            </Content>
          </div>
          )}
      </BrowserRouter>
    );
  }
};
