import React, { Component } from 'react';

const Filler = (props) => {

    let itemWidth = props.item_co2/props.total_co2*100
    return (
        <div className='mini-filler' style={{width: `${itemWidth}%`}}/>
        // <div className='mini-filler' style={{width: `${this.props.item_co2/props.total_co2*100}%`}}/>
        )

}

const MiniProgressBar = (props) => {
    return(
        <div className='mini-bar' >
            
        <Filler total_co2={props.total_co2}
                        item_co2={props.item_co2}/>
        
        </div>
    ) 
}

class MiniBar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <MiniProgressBar total_co2={this.props.total_co2}
                        item_co2={this.props.item_co2}
                         />

         );
    }
}
 
export default MiniBar;