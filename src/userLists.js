import React from "react";
import RecordFoodList from './RecordFoodList'

class UserLists extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userRecords : [],
            logIn : null,
        }
        this.handleClick = this.handleClick.bind(this)
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

    handleClick(recordid,e) {
        alert(recordid)
        e.preventDefault();   
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
                    <td >{list[2]}</td>
                    <td >{list[3]} kg CO2</td>
                    <td><button onClick={(e) => this.handleClick(list[1], e)}>See List</button></td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    );
    }
}

export default UserLists;