import React from 'react';
import moment from 'moment';

require("moment-duration-format");


export default class List extends React.Component  {

	render() {
		
		let listItems = this.props.items.reverse().map((item, index) => {
	      return (
	        <tr key={index} className="list-group-item">
	        	<td><span>{item.activityDate}</span></td>
	            <td><span className="activity__type">{item.activityType}</span></td>
	            <td><span>{item.distance} {item.measurementSelect} </span></td>
	            <td className="time">
		            <span>
		            {moment.duration(item.totalDuration, "seconds").format("h:mm:ss")}
		            </span>
	            </td>
	            <td><span ref="eventPace">{item.pace}</span></td>
	          	<td>
	          		<a href="#" onClick={this.props.remove.bind(null, index)}>Delete</a>
	          	</td>
	        </tr>
	      )
	    })

	    return (
	      <div className="col-sm-12">
	        <table className="table">
	          <thead>
		          <tr>
		            <th>Date</th>
		            <th>Activity</th>
		            <th>Distance</th>
		            <th>Time</th>
		            <th>Pace</th>
		            <th>Remove</th>
		          </tr>
		      </thead>
		      <tbody>
	          	{listItems}
	          </tbody>
	        </table> 
	      </div>
	    )
	}
};
