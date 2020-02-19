import React from "react";

class NavBar extends React.Component {
  createMenuItems = () => {
    let menuItems = [];
    for (let k in this.props.menuItems) {
      menuItems.push(<li key={k}>{this.props.menuItems[k].title}</li>);
    }
    return menuItems;
  };

  render() {
    return (
      <nav className="menu">
        <ul className="menu-list">{this.createMenuItems()}</ul>
      </nav>
    );
  }
}
export default NavBar;
