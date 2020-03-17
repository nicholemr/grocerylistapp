import React, { Component } from 'react';
import cargreen from './img/car-brown.png'
import Jello from 'react-reveal/Jello';
// 0.392kg of CO2 output per 1 mile
// max: 510 miles or 196 kg of CO2
//  13,476 miles per year = 5,292kg CO2
// per month: 1123 miles and 441kg CO2


const Filler = (props) => {
    let marginLeft = props.marginLength;
    let isRed = false;
    if (props.marginLeft > 90){ marginLeft = 90}
    if (marginLeft > 95){isRed = true}

    return (
        <div className={isRed ? 'filler-red' : 'filler'} style={{width: `${marginLeft}%`}}/>
        )

}

const ProgressBar = (props) => {
    return(
        <div className='progress-bar' >
            <Filler total_co2={props.total_co2}
                marginLength = {props.marginLength}
                />
        </div>
    ) 
}
class ProgressBarParent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    render() { 
        const co2kgperMile = 0.392
        const milesEquiv = Math.round(this.props.total_co2/co2kgperMile)
        let marginLength = (milesEquiv/441*2*100)
        // let marginLength = (milesEquiv/441*100)
        let carMargin = marginLength-5
        if (marginLength > 100){
            marginLength = 100
        }

        if (marginLength > 80){
            carMargin = 80
        }
        let display = 
            <div className='miles-label'>
            <h5>{442/2} miles </h5>
        </div>

        return ( 
            <div className="co2summary">
                
                <div className='car'
                    style={{
                        marginLeft:`${carMargin}%`
                    }}>

                    <img src={cargreen}
                        alt="green"></img>
                </div>
                <ProgressBar total_co2={this.props.total_co2}
                            marginLength = {marginLength}
                />

                <div className='below-bar'>
                    <div className='total'
                        style={{
                            marginLeft:`${marginLength}%`
                        }}>
                        <Jello >
                        <h5  key={this.props.total_co2}> {milesEquiv} miles</h5>
                        </Jello>
                    </div>
                        {milesEquiv< 177 ? display : null}
                    
                </div>
                

                
                
            </div>
         );
    }
}
 
export default ProgressBarParent;