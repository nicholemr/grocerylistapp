import React from "react";

class FoodList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foods : []
    }
  }
  
  componentDidMount(){
    fetch("http://localhost:5000/")
    .then(res=> res.json()).then(
      (result)=> {
        console.log(result)
        this.setState({
           foods: result.foods
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }

  render() {

    // let FoodIDs = ["tomatoes", "bananas", "strawberries"];

    return (
    <div className="food-list">
      <ul>Food Items</ul>

      {this.state.foods.map(food => (
        <li key={food}>{food}</li>
      ))}
    </div>
    )}
};

export default FoodList;
