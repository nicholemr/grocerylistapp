import React from "react";

class FoodList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foods : []
    }
  }
  
  componentDidMount(){
    // fetch("http://localhost:5000/get-food")
    // .then(res=> res.json()).then(
    //   (result)=> {
    //     console.log(result)
    //     this.setState({
    //        foods: result.foods
    //     })
    //     },
    //   (error) => {
    //     console.error(error)
    //   }
    // )
  }

  render() {


    return (
    <div className="food-list">
      <ul>Food Items</ul>
      <li>{this.props.foodId}</li>
      <li>{this.props.foodQty}</li>
      <li>{this.props.foodCo2}</li>
      {/* {this.state.foods.map(food => (
        <li key={food}>{food}</li>
      ))} */}
    </div>
    )}
};

export default FoodList;
