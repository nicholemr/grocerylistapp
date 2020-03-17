import React from "react";
import FoodsList from './FoodsList'
import Co2Summary from './Co2Summary'
import Input from './styled/Input'
import ButtonAdd from './styled/ButtonAdd'

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
    this.handleQtyChange = this.handleQtyChange.bind(this);
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

  handleQtyChange(event){
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
                                total_co2: json.total_co2,
                                foodId: "",
                                foodQty: "",})
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
          if (json.results){
            this.setState({ suggestions: json.results}) 
          }else {
              this.setState({ suggestions: ""})
            } 
            console.log(json.results)
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
      <div className='FoodForm-Component'>
        
        <Co2Summary total_co2={this.state.total_co2} />
        
        <form className="food-form" onSubmit={this.handleSubmit}>
          <label htmlFor="foodId">
            <Input
              id="foodId"
              name="foodId"
              value={this.state.foodId}
              placeholder=" Add Items to List"
              onChange={this.handleAutocompleteChange}
            />
            <ul id="search-suggestions">
              {this.displayResults()}
            </ul>
          </label>
          <label htmlFor="foodQty">
            <Input
              id="foodQty"
              name="foodQty"
              value={this.state.foodQty}
              placeholder=" Quantity (kg)"
              onChange={this.handleQtyChange}
            />
          </label>
          
          <ButtonAdd id="add">Add</ButtonAdd>
          
        </form>
        
        <FoodsList foodDictParentCB={this.foodDictchildrenCB} {...this.state.foodRecordDict} total_co2={this.state.total_co2} />
        
      </div>
    );
    }}
  

export default FoodForm;
