import './App.css';
import React, {useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import AppSwitchRoutes from "./AppSwitchRoutes";
import logo from '../assets/images/tisa-logo.png';
import LoginModal from "./LoginModal/LoginModal";

const App = () => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <Router>
            <div className="App">
                <div className="appHeader">
                    <div>
                        <img className="logo" alt="logo" src={logo}/>
                    </div>
                    <div>
                        <button className="blueButton" onClick={() => setIsLoginModalOpen(true)}>Sign in</button>
                    </div>
                </div>
                <AppSwitchRoutes/>
                <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
            </div>
        </Router>
    );
}

export default App;
