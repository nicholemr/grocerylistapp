import React from "react";
import FoodsList from './FoodsList'
import ProgressBarParent from './ProgressBarParent'

class FoodForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      foodId: "",
      foodQty: "",
      foodRecordDict: null,
      total_co2: 0,
      suggestions: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAutocompleteChange = this.handleAutocompleteChange.bind(this);
     
  }

  componentDidMount() {
    if (this.props.recordid){
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
    let url = `http://localhost:5000/add-food`;
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

  handleAutocompleteChange(event){
    this.setState({
        foodId: event.target.value,
    })

    let url = `http://localhost:5000/autocomplete?prefix=${event.target.value}`;

    fetch(url, {method: 'GET',
              mode:'cors',
              credentials: 'include',
              headers:{"Content-Type":"application/json"} })
      .then(res => res.json())
        .then(json => {
            this.setState({ suggestions: json.results,
            }) 
            console.log(json.results)
        //     if (json.message){
        //       alert(json.message)
        //     } else {
        //   }
      },(error) => {console.error(error)});

    }

  suggestionSelected (value) {
    this.setState({
      foodId: value,
      suggestions: ""
    })
  }

  displayResults = () => {
    let suggestionsList = [];

    for (let food of this.state.suggestions){
      suggestionsList.push(<li key={food} onClick={()=>this.suggestionSelected(food)}>{food}</li>)
    }

    return suggestionsList;
  }

  foodDictchildrenCB = (updated_foodRecordDict, updated_total_co2) => {
    
    if (updated_foodRecordDict){
      this.setState({
        foodRecordDict : updated_foodRecordDict,
        total_co2: updated_total_co2
      })
    } else {
      this.setState({
        total_co2: updated_total_co2
      })
    }
    
  }



  render(){

    return (
      <div >
        <ProgressBarParent total_co2={this.state.total_co2} />
        <h2>Add Items to Grocery List</h2>
        <form className="search-food" onSubmit={this.handleSubmit}>
          <label htmlFor="foodId">
            Food ID:
            <input
              id="foodId"
              name="foodId"
              value={this.state.foodId}
              placeholder="Enter Food ID"
              onChange={this.handleAutocompleteChange}
            />
            <ul >
              {this.displayResults()}
            </ul>
          </label>
          
          <span></span>
          <label htmlFor="foodQty">
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
        
        <FoodsList foodDictParentCB={this.foodDictchildrenCB} {...this.state.foodRecordDict} total_co2={this.state.total_co2} />
        
      </div>
    );
    }}
  

export default FoodForm;
