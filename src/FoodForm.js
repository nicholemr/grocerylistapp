import React from "react";

class FoodForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foodId: "",
      foodQty: "",
      foodCo2: "",
      foodRecordDict: null,
      total_co2: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this)   
  }

  componentDidMount() {
    if (this.props.recordid){
        // console.log(typeof this.props.recordid)
      let url = `http://localhost:5000/user-records/${this.props.recordid}`
        
        fetch(url,
                {mode: 'cors',
                credentials: 'include'},
            ).then(res=> res.json()
                ).then((result)=> {
                  this.setState({ foodRecordDict: result.food_records,
                                  total_co2: result.total_co2
                              })
                },
                (error) => {console.error(error)})
    }
  }


  handleChange(event){
    this.setState({
        [event.target.name]: event.target.value,
    })
  }


  handleSubmit(event) {
    let url = `http://localhost:5000/add-food?foodId=${this.state.foodId}&foodQty=${this.state.foodQty}`;
    
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
            if (json.message){
              alert(json.message)
            } else {
              this.setState({ foodRecordDict: json.food_records,
                                total_co2: json.total_co2})
          }
      },(error) => {console.error(error)});

      event.preventDefault();      
  }

  handleClick(foodRecordId, e){

    let url = `http://localhost:5000/delete-food-record-id/${foodRecordId}`
        
        fetch(url,
                {mode: 'cors',
                credentials: 'include'},
            ).then(res=> res.json()
                ).then((result)=> {
                  if (result.confirmDelete){
                    alert(result.message)
                    let foodRecordDictUpdate = this.state.foodRecordDict;
                    delete foodRecordDictUpdate[foodRecordId];
                    this.setState({foodRecordDict: foodRecordDictUpdate})
                  }

                },
                (error) => {console.error(error)})

    e.preventDefault();  
  }

  createfoodRecordDict = () => {
    let foodRecordDictDisplay = [];

    for (let i in this.state.foodRecordDict){
      console.log(i)
      foodRecordDictDisplay.push(
        <tr key={i}>
          <td>{this.state.foodRecordDict[i].food_id} </td>
          <td>{this.state.foodRecordDict[i].qty}</td>
          <td>{this.state.foodRecordDict[i].co2_output} </td>
          <td><button key={i} onClick={(e) => this.handleClick(i, e)}>DELETE</button></td>
        </tr>
      )
    }
    return foodRecordDictDisplay;
  }

  render(){

    console.log('this.state.foodRecordDict ', this.state.foodRecordDict)

    let display = null;
    
    if (this.state.foodRecordDict){
      display = 
      <table>
        <thead>
        <tr>
          <th>Food ID</th>
          <th>Quantity (kg)</th>
          <th>CO2 Output (kg)</th>
        </tr>
        </thead>
        <tbody>{this.createfoodRecordDict()}</tbody>
      </table>
    }

    return (
      <div className="search-food">
        <h2>Add Items to Grocery List</h2>
        <h3>Your total CO2 Output for this list is {this.state.total_co2} kg</h3>
        
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
          <span></span>
          <label htmlFor="food_qty">
            Quantity (kg):
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
