import React from 'react';
import logo from '../images/logo.png';

export default class Header extends React.Component  {



	render() {
	  return(

		<div className="header">
		  <div className="navigation container">
		    <div className="logo">
			  <a href="/"><img src={logo} alt="Fitcabin" /></a>
		  	</div>
			{this.props.children}
		  </div>
		</div>

	  );
	}

};