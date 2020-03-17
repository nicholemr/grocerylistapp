import React, { Component } from 'react';

class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prefix: "",
            suggestions:""
          }
          // this.handleSubmit = this.handleSubmit.bind(this);
          this.handleAutocompleteChange = this.handleAutocompleteChange.bind(this);
    }


      handleAutocompleteChange(event){
        this.setState({
            prefix: event.target.value,
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
          prefix: value,
          suggestions: []
        })
      }

      displayResults = () => {
        let suggestionsList = [];

        for (let food of this.state.suggestions){
          suggestionsList.push(<li key={food} onClick={()=>this.suggestionSelected(food)}>{food}</li>)
        }

        return suggestionsList;
      }


    render() { 


        return ( 
          <div className="search-food">
            <h2>autocomplete</h2>
            <input
              id="prefix"
              name="prefix"
              value={this.state.prefix}
              placeholder="Enter Food ID"
              onChange={this.handleAutocompleteChange}
            />
            <ul>
              {this.displayResults()}
            </ul>


          </div>
         );
    }
}
 
export default Autocomplete;