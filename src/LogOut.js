import React, { Component } from 'react';
class LogOut extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handleClick(event) {
        let url = `http://localhost:5000/logout`;
        fetch(url, {method: 'GET',
                    mode:'cors',
                    credentials: 'include',
                    })
      .then(res => res.json())
      .then(json => {
          alert(json.message)
        },(error) => {console.error(error)});
        
        event.preventDefault();   
    }

    render() { 
        return ( 
        <div>
        <button onClick={this.handleClick}>
            Log Out
        </button>
        </div>
         );
    }
}
 
export default LogOut;