import React, { Component } from 'react';
import FoodForm from "./FoodForm"

class GroceryListRecord extends Component {
    constructor(props) {
        super(props);
        this.state = { recordid : null,
                    }
        
    }

    componentDidMount() {
        let url = `http://localhost:5000/create-record`;
        fetch(url, {method: 'POST',
                    mode:'cors',
                    credentials: 'include',
                    })
      .then(res => res.json())
      .then(json => {
            this.setState({ recordid: json.recordid}
                )
        },(error) => {console.error(error)});
        
    }

    render() { 
       if (this.state.recordid){
       return (
        // <div >
            <FoodForm recordid={this.state.recordid}>
                <h1>Hiiiiii</h1>
            </FoodForm>
        // </div>
       )
       } else {
           return null;
       }

    }
}
 
export default GroceryListRecord;