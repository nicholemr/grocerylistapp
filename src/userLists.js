import React from "react";

class UserLists extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userRecords : [],
            logIn : null,
        }
    }

    componentDidMount() {
        let url = "http://localhost:5000/user-records"
        
        fetch(url,
                {mode: 'cors',
                credentials: 'include'},
            ).then(res=> res.json()
                ).then((result)=> {
                    if (result.login){
                        this.setState({userRecords: result.lists})
                    } else {
                        alert(result.login)
                    }
                },
                (error) => {console.error(error)})
    }

    render(){

    return (
        // <a id="view-all-lists" href=""> View All Lists </a>
        <div>
            <h3>View All Lists by {this.props.username} </h3>
            {this.state.userRecords.map(list =>(
                <li key={list[1]}>{list[0]} - {list[1]} kg CO2</li>
            ))}

        </div>
    );
    }
}

export default UserLists;