import React from 'react'
import { ref, firebaseAuth } from '../config/constants'
import profilePic from '../images/default_image.jpg';
import MileageChart from '../components/MileageChart';
import moment from 'moment'

let userName
let removeListener
let weekDistance



const getUserInfo = () => {
	removeListener = firebaseAuth().onAuthStateChanged((user) => {
	  if (user) {
		let userId = firebaseAuth().currentUser.uid;
		return ref.child(`users/${userId}/profile/`).once('value').then(getUserName)
	  }
	})
}

const getUserName = (snapshot) => {
	userName = snapshot.val().name
	return userName
}


const calcWeekTotal = (snapshot) => {
	weekDistance = 0
	let startOfWeek = moment().startOf('week');
	let endOfWeek = moment().endOf('week');

	let days = [];
	let day = startOfWeek;

	while (day <= endOfWeek) {
    	days.push(day.toDate());
    	day = day.clone().add(1, 'd');
	}


	let daysWithActivities = [];

	let formattedWeek = days.map( (day) => {
		snapshot.forEach((childSnapshot) => {
			
			if ((moment(day).toJSON()) === (childSnapshot.val().sortDate)) {
				daysWithActivities.push(childSnapshot.val().sortDate)
			
				weekDistance += parseFloat(childSnapshot.val().distance)
			} else {
				
			}
		})
	})

	return weekDistance
}


const getCurrentWeek = () => {
	firebaseAuth().onAuthStateChanged((user) => {
		if (user) {
			return ref.child(`/activities/${user.uid}/`).on('value', calcWeekTotal)
		} else {
			console.log("No user logged in")
		}
	})
}
Promise.all([getUserInfo(), getCurrentWeek()])

export default class Dashboard extends React.Component  {
  
  constructor(props) {
      super(props);
      this.state = {
    	goalDistance: '',
    	goalDistanceMeasure: 'mi'
	  };

	  this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
  	getUserInfo()
  	getCurrentWeek()
  }
  
  componentWillUnmount(){
    removeListener()
  }

  handleSubmit(e){
  	  e.preventDefault();

  	  if (this.state.goalDistance === '') {
  	  	this.setState({goalDistance: 0})
  	  }

  	  

  	  this.setState({
    	goalDistance: ''
	  });

  }

  handleChange(name, e) {
  	  let change = {};
  	  change[name] = e.target.value;
  	  this.setState(change);
  }


  render() {

    return (
     <div>
      <div className="user__profile">
        <div className="user__profile--image">
          <img src={profilePic} alt="Profile" />
        </div>
        <div className="user__profile--content">
          <h2>Hello, {userName}!</h2>
          <div className="weekly-goal__container">
            <form onSubmit={this.handleSubmit}>
	          <label className="weekly-goal__content">What is your weekly goal?
	    	    <input type="number" placeholder="0" value={this.state.goalDistance} onChange={this.handleChange.bind(this, 'goalDistance')} />
	    	    <select className="measurement__selector" value={this.state.goalDistanceMeasure} onChange={this.handleChange.bind(this, 'goalDistanceMeasure')}>
					<option value="mi">mi</option>
					<option value="km">km</option>
				</select>
				<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></span>
    	  	   </label>
    	  	   <div className="weekly-goal__button">
			  	 <input type="submit" value="Submit" />
			   </div>
			</form>
    	  </div>
        </div>
      </div>
      <div className="mileage__chart"> 
      	<MileageChart value={weekDistance} />
      </div>
     </div>
    )
  }
}
