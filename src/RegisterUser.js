import React, { Component } from 'react';
import Input from './styled/Input'
import Button from './styled/Button'

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            password : "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    sendDataToParent = (serverData) => {
        this.props.loginParentCb(serverData)
    }

    handleSubmit(event){
        let url = "http://localhost:5000/register"
        const formData = {username:this.state.username, password:this.state.password}

        fetch(url, {method: 'POST',
                    mode: 'cors', 
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"}} 
            ).then(res=> res.json()
                ).then((serverJson)=> {
                    console.log('RegisterUser handleSubmit result from server: ', serverJson)
                        this.sendDataToParent(serverJson)
                        alert(serverJson.message)
                    },(error) => {console.error(error)})

        event.preventDefault();
    }
    
    render() { 

        return ( 
            <div className='register'>
                <h3>Register:</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="register-username">
                    <Input
                        id="register-username"
                        type="text"
                        name="username"
                        value={this.state.username}
                        placeholder="Enter Username"
                        onChange={this.handleChange}
                    />
                    </label>
                    <label htmlFor="register-password">
                    <Input
                        id="register-password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        placeholder="Enter Password"
                        onChange={this.handleChange}
                    />
                    </label>
                    <Button>Submit</Button>
                </form>
                
            </div>
            );
        }
    }
 
export default RegisterUser;