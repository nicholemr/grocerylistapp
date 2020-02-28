import React, { Component } from 'react';
import FoodForm from "./FoodForm"
import UserLIsts from "./userLists"

class CreateNewList extends Component {
    constructor(props) {
        super(props);
        this.state = { recordid : null,
                    total_co2: null,
                    }
        
        this.handleClick = this.handleClick.bind(this);   
    }

    componentDidMount() {
        let url = `http://localhost:5000/create-record`;
        fetch(url, {method: 'GET',
                    mode:'cors',
                    // body: JSON.stringify(formData),
                    credentials: 'include',
                    })
      .then(res => res.json())
      .then(json => {
        if (json.recordid){
          this.setState({ recordid: json.recordid,
                        total_co2: json.total_co2})
        } 
        },(error) => {console.error(error)});
    }

    handleClick(event) {
        let url = `http://localhost:5000/create-record`;
        fetch(url, {method: 'POST',
                    mode:'cors',
                    credentials: 'include',
                    })
      .then(res => res.json())
      .then(json => {
        if (json.recordid){
          this.setState({ recordid: json.recordid,
                    })
        } else {
          alert(json.message)
        }
        },(error) => {console.error(error)});
        
        event.preventDefault();   
    }

    render() { 
        if (!this.state.recordid){
            return (  
                <div>
                    <button onClick={this.handleClick}>
                    Create New List
                    </button>
                    <UserLIsts username = {this.props.username}/>
                </div>
            );
        } else {
            return (
                <div>
                    <FoodForm recordid={this.state.recordid}
                        total_co2={this.state.total_co2}
                        />
                    <UserLIsts username = {this.props.username}/>
                </div>
                
            )
        }
        
    }
}
 
export default CreateNewList;