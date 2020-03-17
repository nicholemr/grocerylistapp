import React from "react";
import RecordFoodList from './RecordFoodList'

class UserLists extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userRecords : {},
            logIn : null,
            displayRecords: []
        }
        this.handleDisplay = this.handleDisplay.bind(this)
    }

    componentDidMount() {
        let url = "http://localhost:5000/user-records"
        
        fetch(url,
                {mode: 'cors',
                credentials: 'include'},
            ).then(res=> res.json()
                ).then((result)=> {
                    // alert(result.message)
                    if (result.login){
                        this.setState({userRecords: result.record_dict})
                    } else {
                        alert(result.login)
                    }
                },
                (error) => {console.error(error)})
    }

    
    handleDisplay(clickedRecordid,e) {
        let displayRecordsUpdate = []
        
        if (this.state.displayRecords.includes(clickedRecordid)){
            displayRecordsUpdate = this.state.displayRecords.filter(
                function(record){
                    return record !== clickedRecordid
                }
            )
        } else {
            displayRecordsUpdate = this.state.displayRecords;
            displayRecordsUpdate.push(clickedRecordid)
        }

        this.setState({displayRecords:displayRecordsUpdate})
     
        e.preventDefault();   
    }


    handleDelete(clickedRecordId, e){
        
        let deleteConfirm = prompt('Are you sure you want to delete?')

        if (deleteConfirm === 'yes' || deleteConfirm === 'Yes' || deleteConfirm === 'Y' | deleteConfirm === 'y'){
            if (this.props.recordid && clickedRecordId === this.props.recordid.toString()){
                alert("Can't delete active grocery list")
            } else{
                let url = `http://localhost:5000/delete-record-id/${clickedRecordId}`
                
                fetch(url,
                        {mode: 'cors',
                        credentials: 'include'},
                    ).then(res=> res.json()
                        ).then((result)=> {
                            if (result.confirmDelete){
                                alert(result.message)
                                let userRecordsUpdate = this.state.userRecords;
                                delete userRecordsUpdate[clickedRecordId];
                                this.setState(
                                    {userRecords: userRecordsUpdate,
                                    })
                          }
        
                        },
                        (error) => {console.error(error)})
            }

        }
        
        e.preventDefault();  
      }


    displayUserRecords = () => {
    let recordDictDisplay = [];

    for (let i in this.state.userRecords){
        recordDictDisplay.push(
        <tr key={i}>
            <td>{this.state.userRecords[i].date_created} </td>
            <td>{this.state.userRecords[i].total_co2} kg CO2</td>
            <td><button id={i} onClick={(e) => this.handleDisplay(i, e)}>{this.state.displayRecords.includes(i) ? 'Hide List' : 'View List'} </button></td>
            <td><button key={i} onClick={(e) => this.handleDelete(i, e)}>DELETE</button></td>
            {this.state.displayRecords.includes(i) && <td id={i}><RecordFoodList recordid={i}/></td>}
        </tr>
        )
    }
    return recordDictDisplay;
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
            {this.displayUserRecords()}
            </tbody>
            </table>
        </div>
    );
    }
}

export default UserLists;