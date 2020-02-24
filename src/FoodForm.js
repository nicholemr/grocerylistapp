import React from "react";

class FoodForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foodId: "",
      foodQty: "",
      foodCo2: "",
      listItems: []
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
    let url = `http://localhost:5000/get-food?foodId=${this.state.foodId}&foodQty=${this.state.foodQty}`;
    
    if (!this.props.createdList){
      fetch(url, {method: 'GET',
                mode:'cors',
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
    } else {
      // alert(`this.props.createdList ${this.props.createdList}`)
      
      let formData = {
        'foodId': this.state.foodId,
        'foodQty': this.state.foodQty
      }

      fetch(url, {method: 'POST',
                mode:'cors',
                body: JSON.stringify(formData),
                credentials: 'include',
                headers:{"Content-Type":"application/json"} })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({ listItems: json})
          //                 foodId: json.food_id})
        // if (json.found_foodid){
        //   this.setState({ foodCo2: json.item_co2,
        //                 foodId: json.food_id})
        // } else {
        //   alert(json.message)
        // }
        },(error) => {console.error(error)});
    }
    
    
    event.preventDefault();      
  }

  createListItems = () => {
    let listItemsDisplay = [];
    for (let i in this.state.listItems){
      listItemsDisplay.push(
        <li key={i}>
          <span>{this.state.listItems[i].food_id} </span>
          <span> {this.state.listItems[i].qty} kg -</span>
          <span>CO2 Output(kg): {this.state.listItems[i].co2_output} </span>
        </li>
      )
    }
    return listItemsDisplay;
  }

  render(){
    // console.log('hi',this.props.createdList)
    

    let display = <p></p>
    
    if (this.state.foodCo2){
      display = 
        <ul id="food-list">
          <h3 id="food-list">Food List</h3>
          <li id="food-list">{this.state.foodId}  {this.state.foodQty} kg  {this.state.foodCo2} kg of CO2</li>
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
        {this.createListItems()}
        {display}
        
      </div>
    );
    }}
  

export default FoodForm;
