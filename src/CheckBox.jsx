import React, { Component } from 'react';

class CheckboxClass extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            foodCheck: false,

         }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    handleCheckboxChange(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
    
        this.setState({
          [name]: value
        });

        let url = `http://localhost:5000/update-food-boolean/${this.props.food_record_id}`
        let formData = {
            'foodCheck': value,
          }

          fetch(url, {method: 'POST',
                    mode:'cors',
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"} }
                ).then(res=> res.json()
                    ).then((result)=> {
                        if (result.confirmUpdate){
                        this.sendDataToParent(result.total_co2)
                        }
                    },
                (error) => {console.error(error)})
        
            
        event.preventDefault();  
    }

    render() { 
        return ( 
            div className='one'>
                <input 
                name='foodCheck'
                type='checkbox' 
                checked={this.state.foodCheck}
                onChange={this.handleCheckboxChange} />
            <span></span>
            </div>
         );
    }
}
 
export default CheckboxClass;