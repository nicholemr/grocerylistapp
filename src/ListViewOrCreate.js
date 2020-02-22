import React, { Component } from 'react';
import FoodForm from "./FoodForm"

class ListViewOrCreate extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            createList : null,
            viewAllLists : null
         }
         this.handleVALclick = this.handleVALclick.bind(this);
         this.handleCNLclick = this.handleCNLclick.bind(this);
    
    }

    handleVALclick(){
        this.setState(
            {createList: false,
            viewAllLists: true}
        )
        alert('View All Lists !')
    }

    handleCNLclick(){
        this.setState(
            {createList: true,
            viewAllLists: false}
        )
        alert('Create New List!')
    }





    render() { 
        let display;
        
        if (this.createList){
            display = <FoodForm />
        }

        return ( 
            <div>
                <li><a href="" onClick={this.handleVALclick}>View All Lists</a></li>
                <li><a href="" onClick={this.handleCNLclick}>Create New List</a></li>
                {display}
            </div>
            
         );
    }
}
 
export default ListViewOrCreate;