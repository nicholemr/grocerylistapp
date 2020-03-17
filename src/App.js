import React from 'react';
import './App.css';
import LogIn from './LogIn'
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Spartan&display=swap');
body {
    font-family: 'Spartan', sans-serif;
    background-color: #c2e3eee7;

}`


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
     }
  }

  


  render() { 

    return ( 
      <div>
        <GlobalStyles />
        <LogIn />
        </div>
     );
  }
}
 
export default App;
