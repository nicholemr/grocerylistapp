import React from "react";
import LogIn from "./LogIn"

class NavBar extends React.Component {

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
    return (
      <nav className="menu">
        <ul className="menu-list">{this.createMenuItems()}
        <LogIn />
        </ul>
      </nav>
    );
  }
}
export default NavBar;
