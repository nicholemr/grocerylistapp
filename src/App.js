import React from 'react';
import './App.css';
import { render } from "react-dom";
import FoodForm from "./FoodForm";
import FoodList from "./foodList";
import NavBar from "./NavBar";

function App() {
  let navLinks = {
    homepage: {
      title: "Homepage",
      link: "homepageLink"
    },
    login: {
      title: "Log In",
      link: "http://localhost:5000/"
    },
    logout: {
      title: "Log Out",
      link: "logoutLink"
    },
    register: {
      title: "Register New User",
      link: "registerLink"
    }
  };

  

  return (
    <div>
      <NavBar menuItems={navLinks} />
      <FoodForm />
      <FoodList />
    </div>
  );
}

export default App;
