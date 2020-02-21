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
          console.log(json)
          this.setState({ foodCo2: json.item_co2})

        } else {
          alert(json.message)
        }
        },(error) => {console.error(error)});
    event.preventDefault();      
  }

  render(){
    console.log(this.state.foodCo2)
    return (
      <div className="search-food">
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
          <li>{this.state.foodId}</li>
          <li>{this.state.foodQty}</li>
          <li>{this.state.foodCo2}</li>
          <button>Submit</button>
          {/* <FoodList foodId={this.state.foodId} foodQty={this.state.foodQty}/> */}
        </form>
      </div>
    );
    }}
  

export default FoodForm;
