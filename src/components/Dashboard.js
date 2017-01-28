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
 
  componentWillMount() {
  	getUserInfo()
  	getCurrentWeek()
  }
  
  componentWillUnmount(){
    removeListener()
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
        </div>
      </div>
      <div className="mileage__chart">
      	<MileageChart value={weekDistance} />
      </div>
     </div>
    )
  }
}
