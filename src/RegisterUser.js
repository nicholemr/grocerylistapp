import React, { Component } from 'react';

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            password : "",
            logIn : null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleSubmit(event){
        let url = "http://localhost:5000/register"
        const formData = {username:this.state.username, password:this.state.password}
        console.log(formData)

        fetch(url, {method: 'POST',
                    mode: 'cors', 
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"}} 
            ).then(res=> res.json()
                ).then((result)=> {
                    console.log('RegisterUser handleSubmit result: ', result)
                        this.setState({logIn: true})
                        alert(result.message)
                    },(error) => {console.error(error)})

        event.preventDefault();
    }
    
    render() { 
        return ( 
            <div>
                <h3>Register</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="register-username">
                    Username:
                    <input
                        id="register-username"
                        type="text"
                        name="username"
                        value={this.state.username}
                        placeholder="Enter Username"
                        onChange={this.handleChange}
                    />
                    </label>
                    <label htmlFor="register-password">
                    Password:
                    <input
                        id="register-password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        placeholder="Enter Password"
                        onChange={this.handleChange}
                    />
                    </label>
                    <button>Submit</button>
                </form>
            </div>
            );
        }
    }
 
export default RegisterUser;