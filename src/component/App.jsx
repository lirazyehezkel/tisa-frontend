import './App.css';
import React, {useState} from 'react';
import {BrowserRouter as Router, Link} from "react-router-dom";
import AppSwitchRoutes from "./AppSwitchRoutes";
import logo from '../assets/images/tisa-logo.png';
import profile from '../assets/images/user.png';
import LoginModal from "./LoginModal/LoginModal";
import {Routes} from '../constants/routes';
import {createTheme, MuiThemeProvider} from "@material-ui/core";
import {ToastContainer, toast} from "react-toastify";

const theme = createTheme({
    palette: {
        secondary: {
            main: '#E33E7F'
        },
        primary: {
            main: '#24394a'
        }
    }
});

const App = () => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <div className="appHeader">
                        <div>
                            <Link to={Routes.BROWSE}><img className="logo" alt="logo" src={logo}/></Link>
                        </div>
                        <div>
                            {/*<button className="blueButton" onClick={() => setIsLoginModalOpen(true)}>Sign In</button>*/}
                            <div className="helloUser"><span>Hello, Liraz</span><Link to={Routes.PROFILE}><img className="profileIcon" alt="profile" src={profile}/></Link></div>
                        </div>
                    </div>
                    <AppSwitchRoutes/>
                    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
                </div>
            </Router>
            <ToastContainer style={{zIndex: 2147483004}} position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true}/>
        </MuiThemeProvider>
    );
}

export default App;
