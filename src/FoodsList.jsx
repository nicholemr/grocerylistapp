import React, { Component } from 'react';
import FoodItem from './FoodItem'



class FoodsList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          updatedCo2: 0,
          deleteConfirm: false,
         }
    }
    
    Co2childrenCB = (updated_co2) => {
      this.setState({
        updatedCo2 : updated_co2
      })
      let emptyD = false
      this.props.foodDictParentCB(emptyD, updated_co2)
    }

    deleteChildCB = (foodRecordId) =>{

          let url = `http://localhost:5000/delete-food-record-id/${foodRecordId}`
          
          fetch(url,
                  {mode: 'cors',
                  credentials: 'include'},
              ).then(res=> res.json()
                  ).then((result)=> {
                  
                  if (result.confirmDelete){
                      this.setState({
                        updatedCo2: result.total_co2
                      })
                      this.props.foodDictParentCB(result.food_records, result.total_co2)
                  }
  
                  },
                  (error) => {console.error(error)})
    }
    
    
    displayFoodsInRecord = () => {
        let foodRecordDictDisplay = [];
    
        for (let food_record_id in this.props){
          if (food_record_id !== 'foodDictParentCB' && food_record_id !== 'total_co2'){
            foodRecordDictDisplay.push(
              <FoodItem 
              key= {food_record_id}
              food_record_id = {food_record_id}
              food_id = {this.props[food_record_id].food_id}
              qty = {this.props[food_record_id].qty}
              co2_output = {this.props[food_record_id].co2_output}
              Co2parentCB = {this.Co2childrenCB}
              foodCheckParent = {this.props[food_record_id].foodCheck}
              deleteParentCB = {this.deleteChildCB}
              total_co2 = {this.props.total_co2}
              />
            )
          }
          
        }
        return foodRecordDictDisplay;
      }

    
    render() { 

    let display = null;
    
    if (this.props){
      display = 
      <div className="food-list">
        <div id='row'>
          <div id="one"></div>
          <div id="two"></div>
          <div id="three"></div>
          <div id="four"></div>
          <div id="five-th"><p>CO<sub>2</sub> Item/List</p></div>
          <div id="six"></div>
        </div>
        {this.displayFoodsInRecord()}
      </div>
    }


        return ( 
          <div >
            {display}
          </div>
         );
    }
}
 
export default FoodsList;