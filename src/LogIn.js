import React from "react";
import LogOut from "./LogOut"
import RegisterUser from "./RegisterUser"

import GroceryListRecord from "./GroceryListRecord"
import Welcome from './styled/WelcomeC'
import Global from "./styled/Global"
import Input from './styled/Input'
import Button from './styled/Button'
import TreeImg from './TreeImg'
import TreeImgLogin from './TreeImgLogin'

class LogIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username : "",
            password : "",
            logIn : null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);   
    }

    componentDidMount(){
        // sends a GET request to server to check if user in session
        let url = "http://localhost:5000/login"
        
        fetch(url,
                {mode: 'cors',
                credentials: 'include'},
            ).then(res=> res.json()
                ).then((result)=> {
                    if (result.login){
                        this.setState({logIn: result.login,
                            username: result.username})
                    }
                },
                (error) => {console.error(error)})
      }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    logInChildrenCb = (loginStatus) => {
        this.setState({
            username : loginStatus.username,
            logIn : loginStatus.logIn
        })
    }

    handleLogin(event){
        let url = "http://localhost:5000/login"
        const formData = {username:this.state.username, password:this.state.password}

        fetch(url, {method: 'POST',
                    mode: 'cors', 
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"}} 
            ).then(res=> res.json()
                ).then((result)=> {
                    console.log('LogIn handleLogin result: ', result)
                    if (result.login){
                        this.setState({logIn: true})
                    } else {
                        alert(result.message)
                    }
                    },(error) => {console.error(error)})

        event.preventDefault();
    }
    
    render(){
        
        if (!this.state.logIn){
            return (
                    <div className="login-page" >
                        <Welcome>Carbon Food-Print Grocery List  </Welcome>
                        <div className='login-reg'>
                            <div className='login'>
                                <h3>   Log In:</h3>
                                <form onSubmit={this.handleLogin}>
                                    <label htmlFor="login-username">
                                    <Input
                                        id="login-username"
                                        type="text"
                                        name="username"
                                        value={this.state.username}
                                        placeholder="Enter Username"
                                        onChange={this.handleChange}
                                    />
                                    </label>
                                    <label htmlFor="login-password">
                                    <Input
                                        id="login-password"
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        placeholder="Enter Password"
                                        onChange={this.handleChange}
                                    />
                                    </label>
                                    <Button>Log In</Button>
                                </form>
                            </div>
                            <RegisterUser loginParentCb = {this.logInChildrenCb} />
                        </div>
                        
                        <TreeImgLogin/>
                    </div>
            );
        } else {
            return (
            <div className="main">
                <Global />
                <div className='belowmain'>
                <div className="left">
                <div className='heading'>  
                    <Welcome>Hello {this.state.username}, </Welcome>
                    <Welcome>Welcome to your Carbon Food-Print grocery list ! </Welcome>
                    <br/>
                    <br/>
                    <div className='bar-title'>The bar below displays your list's CO<sub>2</sub> emissions 
                in terms of miles driven by a standard economy car:</div>
                </div>
                <LogOut loginParentCb = {this.logInChildrenCb}
                    logIn = {this.state.logIn}
                />
                
                <GroceryListRecord username = {this.state.username} />
                </div>
                <TreeImg/>
                <div className="bottom"></div>
                </div>
            </div>
            )
        }
    } //render
};//logIn func

export default LogIn;
