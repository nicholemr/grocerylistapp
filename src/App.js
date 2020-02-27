import React from 'react';
// import './App.css';
import LogIn from "./LogIn"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      username : "",
      password : "",
      logIn : null,
     }
  }

  


  render() { 

    return ( 
      <div>
        <LogIn />
      </div>
     );
  }
}
 
export default App;
