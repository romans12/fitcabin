import React from 'react';
import { firebaseAuth } from '../config/constants'
import Datetime from 'react-datetime'
import moment from 'moment'

const calculatePace = (distance, durationInSeconds, measurementSelect) => {
	let secondsOverDistance = parseFloat(durationInSeconds / distance);
	let roundedMinutes = Math.floor(secondsOverDistance / 60.0);
	let secondsLeftOver = Math.round(parseFloat(((secondsOverDistance / 60.0) - roundedMinutes) * 60.0 )) ;

	if ((secondsLeftOver < 10) && (secondsLeftOver >= 1)) {
        secondsLeftOver = "0" + secondsLeftOver.toPrecision(1).toString();
    };

    if (secondsLeftOver < 1) {
        secondsLeftOver += "0";
    };

	let pace = roundedMinutes.toString() + ":" + secondsLeftOver.toString() + "/" + measurementSelect;
	return pace;
}

const formatDistanceString = (distance, measurementSelect) => {
	if ((measurementSelect === "km") && (distance > 1) ) {
	  	measurementSelect = "kilometers";
	} else if ((measurementSelect === "km") && (distance <= 1) ) {
	  	measurementSelect = "kilometer";
	} else if ((measurementSelect === "mi") && (distance > 1) ) {
	  	measurementSelect = "miles";
	} else if ((measurementSelect === "mi") && (distance <= 1) ) {
	  	measurementSelect = "mile";
	}
	return measurementSelect;
}

let userId = '';

export default class AddActivity extends React.Component  {


	constructor(props) {
      super(props);
      this.state = {
    	activityType: 'run',
    	distance: '',
    	durationHour: '',
    	durationMinute: '',
    	durationSecond: '',
    	measurementSelect: 'mi',
    	dateTime: moment(new Date()).format('MMMM Do YYYY')
	  };

	  this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e){
  	  e.preventDefault();

  	  let user = firebaseAuth().currentUser;

	  if (user) {
		  // User is signed in.
		  userId = firebaseAuth().currentUser.uid;
		} else {
		  // No user is signed in.
		  console.log("You need to sign in.")
	  }

  	  if (this.state.durationHour === '') {
  	  	this.setState({durationHour: 0})
  	  }
  	  if (this.state.durationMinute === '') {
  	  	this.setState({durationMinute: 0})
  	  }
  	  if (this.state.durationSecond === '') {
  	  	this.setState({durationSecond: 0})
  	  }
  	  let durationInSeconds = parseFloat((this.state.durationHour * 3600)) + 
    						parseFloat((this.state.durationMinute * 60)) +
    						parseFloat((this.state.durationSecond * 1));

	  let distance = this.state.distance;

	  let measurement = this.state.measurementSelect;

	  let pace = calculatePace(distance, durationInSeconds, measurement);

	  let activityDateSelected = moment(this.state.dateTime, 'MMMM Do YYYY').format('M/D/YY');

  	  this.props.add({
  	  	activityType: this.state.activityType,
  	  	distance: this.state.distance,
  	  	totalDuration: durationInSeconds,
  	  	pace: pace,
  	  	measurementSelect: formatDistanceString(distance, measurement),
  	  	userId: userId,
  	  	activityDate: activityDateSelected,
      	sortDate: moment(this.state.dateTime, 'MMMM Do YYYY').toJSON()
  	  });

  	  this.setState({
    	distance: '',
    	durationHour: '',
    	durationMinute: '',
    	durationSecond: ''
	  });

  	}

  	handleChange(name, e) {
  	  let change = {};
  	  change[name] = e.target.value;
  	  this.setState(change);
  	}



	render() {
	  return ( 
		<div className="AddActivity">
      	  <form onSubmit={this.handleSubmit}>
      	    <div className="activity__title">
			  <label>
			    Did you 
			    <select className="activity__selector" value={this.state.activityType} onChange={this.handleChange.bind(this, 'activityType')}>
				  <option value="run">run</option>
				  <option value="bike">bike</option>
				  <option value="swim">swim</option>
				  <option value="aqua jog">aqua jog</option>
				</select>
				 today? 
			  </label>
			</div>
			<div className="activity__date">
				<Datetime inputProps={ { placeholder:"Select a date", disabled: true, required: true } }
				  value={ this.state.dateTime }
        		  onChange={(data) => this.setState({dateTime: Datetime.moment(data).format("MMMM Do YYYY")})}
        		  open={ true }
    			  timeFormat={ false } 
    			  dateFormat="MMMM Do YYYY" 
    			/>
			</div>
		    <div className="activity__content">
		     <div className="activity__distance">
			  <label>
			    Distance
			    <input type="number" required value={this.state.distance} onChange={this.handleChange.bind(this, 'distance')} />
			    <select className="measurement__selector" value={this.state.measurementSelect} onChange={this.handleChange.bind(this, 'measurementSelect')}>
				  <option value="mi">mi</option>
				  <option value="km">km</option>
				</select>
				<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></span>
			  </label>
			 </div>
			 <div className="activity__duration">
			  <label className="activity__duration--label">
			    Time
			    <div className="duration__input">
			    	<label>
			    	  <abbr title="hours">hr</abbr>
			    	  <input type="number" max="24" min="0" placeholder="0" value={this.state.durationHour} onChange={this.handleChange.bind(this, 'durationHour')} />
			    	</label>
			    	<label>
			    	  <abbr title="minutes">min</abbr>
			    	  <input type="number" max="59" min="0" placeholder="0" value={this.state.durationMinute} onChange={this.handleChange.bind(this, 'durationMinute')} />
			    	</label>
			    	<label>
			    	  <abbr title="seconds">sec</abbr>
			    	  <input type="number" max="59" min="0" placeholder="0" value={this.state.durationSecond} onChange={this.handleChange.bind(this, 'durationSecond')} />
			    	</label>
					<span value={this.props.totalDuration}></span>
			    </div>
			  </label>
			 </div>
			</div>
			<div className="activity__button">
			  <input type="submit" value={"Log this " + this.state.activityType + "!"} />
			</div>
		  </form>
		</div>
	  )
	}


};