import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// import { Router, Route, browserHistory } from 'react-router';

ReactDOM.render(
  // I can use browserHistory here, but if I want to add more pages, I'll have to setup the
  // server to deliver the right page. https://github.com/reactjs/react-router-tutorial/tree/master/lessons/10-clean-urls

  <App />,
  document.getElementById('root')
);
