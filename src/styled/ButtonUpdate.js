import styled from 'styled-components';

export default styled.input.attrs({ 
    type: 'submit',
    value: 'Update'
  })`
font-size: 75%;
color: #804000;
cursor: pointer;
letter-spacing: 1px;
font-family: Roboto;
height: 20px;
width:55px;
border: 1px solid #804000;
border-radius: 50px;
background: transparent;
font-weight: 300;

&:hover {
    background: #804000;
    color: #c2e3eee7;
}`