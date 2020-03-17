import styled from 'styled-components';

export default styled.input`
  font-family: Roboto;
  letter-spacing: 1px;
  font-size: 95%;
  height: 25px;
  width:30px;
  color: #1c5263;
  text-align: center; 

  background-color: transparent;

  border: none;
  border-bottom: 1px solid #1c5263;
  ::placeholder {
    color: #1c5263;
  }

  :focus{
    opacity: 1;
    outline: 0;
    box-shadow: 0 4px 2px -2px #663300;
  }
`