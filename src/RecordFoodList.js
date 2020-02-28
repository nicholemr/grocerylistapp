import React, { Component } from 'react';

class RecordFoodList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listItems: [],
            total_co2: 0
         }
    }

    componentDidMount() {
        if (this.props.recordid){
            // console.log(typeof this.props.recordid)
          let url = `http://localhost:5000/user-records/${this.props.recordid}`
            
            fetch(url,
                    {mode: 'cors',
                    credentials: 'include'},
                ).then(res=> res.json()
                    ).then((result)=> {
                      this.setState({ listItems: result.food_records,
                                      total_co2: result.total_co2
                                  })
                    },
                    (error) => {console.error(error)})
        }
      }

    createListItems = () => {
    let listItemsDisplay = [];
    for (let i in this.state.listItems){
        listItemsDisplay.push(
        <tr key={i}>
            <td>{this.state.listItems[i].food_id} </td>
            <td>{this.state.listItems[i].qty}</td>
            <td>{this.state.listItems[i].co2_output} </td>
        </tr>
        )
    }
    return listItemsDisplay;
    }


    render() { 
        return ( 
                <table>
                    <thead>
                        <tr>
                            <th>Food ID</th>
                            <th>Quantity (kg)</th>
                            <th>CO2 Output (kg)</th>
                        </tr>
                    </thead>
                    <tbody>{this.createListItems()}</tbody>
                </table>
         );
    }
}
 
export default RecordFoodList;