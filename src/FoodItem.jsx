import React, { Component } from 'react';
import MiniBar from './MiniBar';
import InputUpdate from './styled/InputUpdate';
import ButtonUpdate from './styled/ButtonUpdate';
import Checkbox from './styled/Checkbox'
import {Spring} from 'react-spring/renderprops'


class FoodItem extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            updatedQty: '', 
            checked: false,
            updatedItemCo2: false,

         }
        this.handleUpdate = this.handleUpdate.bind(this); 
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        
    }

    componentDidMount() {
        if (this.props.foodCheckParent){
            this.setState({checked: true})
        }
    }

    handleUpdate(event){
        if (this.state.updatedQty > 0){
            
            let url = `http://localhost:5000/update-food-record-id/${this.props.food_record_id}?updatedQty=${this.state.updatedQty}`
            
            fetch(url,
                    {mode: 'cors',
                    credentials: 'include'},
                ).then(res=> res.json()
                    ).then((result)=> {
                        if (result.confirmUpdate){
                        this.sendDataToParent(result.total_co2)
                        this.setState({
                            updatedItemCo2: result.updated_item_co2
                        })
                        }
                    },
                    (error) => {console.error(error)})
        }
        event.preventDefault();  
      }


    handleChange(event){
    this.setState({
        updatedQty: event.target.value,
    })
    }


    sendDataToParent = (updated_co2) => {
        this.props.Co2parentCB(updated_co2)
    }

    handleCheckboxChange(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
    
        this.setState({
            checked: event.target.checked
        });

        let url = `http://localhost:5000/update-food-boolean/${this.props.food_record_id}`
        let formData = {
            'checked': event.target.checked,
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
        
            
        // event.preventDefault();  


    }

    sendDeleteToParent = (foodRecordId) => {
        this.props.deleteParentCB(foodRecordId);
    }

    handleDelete(foodRecordId, e){
        this.sendDeleteToParent(foodRecordId);
        e.preventDefault();  
        }
    
    

    render() { 
        return ( 
            <Spring
            from={{ opacity: 0,
                    marginTop: -1000 }}
            to={{ opacity: 1 ,
                    marginTop: 0}}>
            {props => (<div id='row' style={props}>
                <div className='one'>
                        <label>
                            <Checkbox 
                                    className='checkbox'
                                    checked={this.state.checked}
                                    onChange={this.handleCheckboxChange}
                            />
                            <span></span>
                        </label>
                    </div>
                    
                    <div id='two'>
                        <form onSubmit={this.handleUpdate}>
                            <label htmlFor="updatedQty">
                                <InputUpdate
                                    id={this.props.food_id}
                                    // name="updatedQty"
                                    type="text"
                                    value={this.state.updatedQty}
                                    placeholder={this.props.qty}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <ButtonUpdate />
                        </form></div>
                    <div id='three'>kg of</div>
                    <div id='four'>{this.props.food_id} </div>
                    <div id='five'>
                        <div className='value'>
                        { this.state.updatedItemCo2 ? Math.round(this.state.updatedItemCo2/this.props.total_co2*100) : Math.round(this.props.co2_output/this.props.total_co2*100)} % 
                        </div>
                            <MiniBar total_co2={this.props.total_co2}
                                item_co2={this.state.updatedItemCo2 ? this.state.updatedItemCo2 : this.props.co2_output}
                            />
                    </div>
                    
                    <div id='six'>
                        <button key={this.props.food_record_id} 
                                onClick={(e) => this.handleDelete(this.props.food_record_id, e)}>
                        X
                        </button>
                    </div>
            </div>)}
        </Spring>

         );
    }
}
 
export default FoodItem;