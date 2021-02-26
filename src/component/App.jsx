import './App.css';
import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import AppSwitchRoutes from "./AppSwitchRoutes";

const App = ()  => {

  return (
      <Router>
        <div className="App">
            TISA APP
            <AppSwitchRoutes/>
        </div>
      </Router>
  );
}

export default App;
