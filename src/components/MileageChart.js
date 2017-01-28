import React from 'react'



export default class MileageChart extends React.Component  {


	render() {

		const halfsize = (this.props.size * 0.5);
	    const radius = halfsize - (this.props.strokewidth * 0.5);
	    const circumference = 2 * Math.PI * radius;
	    const strokeval = ((this.props.value * circumference) / 100);
	    const dashval = (strokeval + ' ' + circumference);

	    const trackstyle = {strokeWidth: this.props.strokewidth};
	    const indicatorstyle = {strokeWidth: this.props.strokewidth, strokeDasharray: dashval}
	    const rotateval = 'rotate(-90 '+halfsize+','+halfsize+')';


		return (

		  <svg width={this.props.size} height={this.props.size} className="donutchart">
        	<circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track"/>
        	<circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator"/>
	        <text className="donutchart-text" x={halfsize} y={halfsize} style={{textAnchor:'middle'}} >
	          <tspan className="donutchart-text-val">{this.props.value}</tspan>
	          <tspan className="donutchart-text-percent"></tspan>
	          <tspan className="donutchart-text-label" x={halfsize} y={halfsize+25}>{this.props.valuelabel}</tspan>
	        </text>
      	  </svg>
		)
	}
}

MileageChart.defaultProps = { 
    value: 0,
    valuelabel:'miles this week',
    size: 220,
    strokewidth: 22
}