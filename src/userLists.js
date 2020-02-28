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
                        this.setState({userRecords: result.lists.reverse()})
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
            <h2>View All Lists by {this.props.username} </h2>
            <table>
                <thead>
                    <tr>
                    <th>Date Created</th>
                    <th>Total CO2</th>
                    </tr>
                </thead>
                <tbody>
            {this.state.userRecords.map(list =>(
                <tr key={list[0]}>
                    <td >{list[1]}</td>
                    <td >{list[2]} kg CO2</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    );
    }
}

export default UserLists;