import './App.css';
import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import AppSwitchRoutes from "./AppSwitchRoutes";
import logo from '../assets/images/tisa-logo.png';

const App = ()  => {

  return (
      <Router>
        <div className="App">
            <div className="appHeader">
                <div>
                    <img className="logo" alt="logo" src={logo}/>
                </div>
                <div>
                    <button className="blueButton">Sign in</button>
                </div>
            </div>
            <AppSwitchRoutes/>
        </div>
      </Router>
  );
}

export default App;
