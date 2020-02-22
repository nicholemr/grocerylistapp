import React from "react";
import FoodList from "./foodList";

class FoodForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foodId: "",
      foodQty: "",
      foodCo2: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);   
  }

  handleChange(event){
    this.setState({
        [event.target.name]: event.target.value,
    })
  }


  handleSubmit(event) {
    let url = "http://localhost:5000/get-food";
    const formData = {foodId: this.state.foodId, foodQty: this.state.foodQty}
    fetch(url, {method: 'POST',
                mode:'cors',
                body: JSON.stringify(formData),
                credentials: 'include',
                headers:{"Content-Type":"application/json"} })
      .then(res => res.json())
      .then(json => {
        if (json.found_foodid){
          this.setState({ foodCo2: json.item_co2,
                        foodId: json.food_id})
        } else {
          alert(json.message)
        }
        },(error) => {console.error(error)});
    event.preventDefault();      
  }

  render(){

    let display = <p></p>
    if (this.state.foodCo2){
      display = 
        <ul>
          <h3>Food List</h3>
          <li>{this.state.foodId}  {this.state.foodQty} kg  {this.state.foodCo2} kg of CO2</li>
        </ul>
        
    }

    return (
      <div className="search-food">
        <h1>Query Food</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="food_id">
            Food ID:
            <input
              id="foodId"
              name="foodId"
              value={this.state.foodId}
              placeholder="Enter Food ID"
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor="food_qty">
            Quantity (kg)
            <input
              id="foodQty"
              name="foodQty"
              value={this.state.foodQty}
              placeholder="Enter Quantity"
              onChange={this.handleChange}
            />
          </label>
          
          <button>Submit</button>
          
        </form>
        {display}
        
      </div>
    );
    }}
  

export default FoodForm;
