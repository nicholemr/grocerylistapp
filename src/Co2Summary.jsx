import React, { Component } from 'react';
import ProgressBarParent from './ProgressBarParent'

class Co2Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        
        return(
            <ProgressBarParent total_co2={this.props.total_co2} />
        )
    }
}
 
export default Co2Summary;