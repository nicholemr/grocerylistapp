import React from "react";
import LogOut from "./LogOut"
import RegisterUser from "./RegisterUser"
import UserLIsts from "./userLists"
import CreateNewList from "./CreateNewList"

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

    handleSubmit(event){
        let url = "http://localhost:5000/login"
        const formData = {username:this.state.username, password:this.state.password}

        fetch(url, {method: 'POST',
                    mode: 'cors', 
                    body: JSON.stringify(formData),
                    credentials: 'include',
                    headers:{"Content-Type":"application/json"}} 
            ).then(res=> res.json()
                ).then((result)=> {
                    console.log('LogIn handleSubmit result: ', result)
                    if (result.login){
                        this.setState({logIn: true})
                        alert(result.message)
                    } else {
                        alert(result.message)
                    }
                    },(error) => {console.error(error)})

        event.preventDefault();
    }
    
    render(){


        if (!this.state.logIn){
            return (
               <div>
                   <li><RegisterUser /></li>
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
            return (
            <div>
                <LogOut/>
                <CreateNewList/>
                
                <UserLIsts username={this.state.username}/>
            </div>
            )
        }
    } //render
};//logIn func

export default LogIn;
