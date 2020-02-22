import React from "react";
import LogIn from "./LogIn"
import LogOut from "./LogOut"
import UserLists from "./userLists"

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      username : "",
      password : "",
      logIn : null,
     }
  }

  navLinks = {
            homepage: {
              title: "Homepage",
              link: "http://localhost:8888/"
            },
  };

  createMenuItems = () => { 
    let menuItems = [];
    for (let k in this.navLinks) {
      menuItems.push(<li key={k}><a href={this.navLinks[k].link}>{this.navLinks[k].title}</a></li>);
    }
    return menuItems;
  };

  render() {
    
    console.log("NavBar render state: ",this.state.logIn, this.state.username)

    if (this.props.logIn){
      return (
        <nav className="menu">
          <ul className="menu-list">{this.createMenuItems()}
          <li><LogOut/></li>
          <li><UserLists/></li>
          </ul>
        </nav>
      );
    } else{
      return (
        <nav className="menu">
          <ul className="menu-list">{this.createMenuItems()}
          <LogIn />
          </ul>
        </nav>
      )
    }
    
  }
}
export default NavBar;
