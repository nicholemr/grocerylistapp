import React from "react";
import LogOut from "./LogOut"
import RegisterUser from "./RegisterUser"


class LogIn extends React.Component {
    constructor(props){
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
        const url = "http://localhost:5000/login"
        const formData = {username:this.state.username, password:this.state.password}

        fetch(url, {method: 'POST',
                    mode: 'cors', 
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"}} 
            ).then(res=> res.json()
                ).then((result)=> {
                    console.log(result)
                    if (result.login){
                        this.setState({logIn: true})
                        alert(result.message)
                    } else {
                        alert(result.message)
                }},(error) => {console.error(error)})

        event.preventDefault();
    }
    
    render(){
        console.log(this.state.username)
        console.log(this.state.logIn)
        if (!this.state.logIn){
            return (
               <div>
                   <RegisterUser />
                    <div className="login-form" >
                    <h3>Log In</h3>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="login-username">
                        Username:
                        <input
                            id="login-username"
                            type="text"
                            name="username"
                            value={this.state.username}
                            placeholder="Enter Username"
                            onChange={this.handleChange}
                        />
                        </label>
                        <label htmlFor="login-password">
                        Password:
                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            value={this.state.password}
                            placeholder="Enter Password"
                            onChange={this.handleChange}
                        />
                        </label>
                        <button>Log In</button>
                    </form>
                    </div>
                </div>
            );
        } else {
            return (<LogOut/>)
        }
    } //render
};//logIn func

export default LogIn;
