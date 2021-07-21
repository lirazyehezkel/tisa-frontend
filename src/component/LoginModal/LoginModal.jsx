import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import './LoginModal.css';
import Api from "../../helpers/api";
import {toast} from "react-toastify";
import validator from "validator";
import {useCookies} from "react-cookie";
import {tisaCookie} from "../../helpers/consts";

const SIGN_IN = "Sign In"
const SIGN_UP = "Sign Up"

const LoginModal = ({isOpen, onClose}) => {

    const api = new Api();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState(SIGN_IN);

    useEffect(() => {
        setMode(SIGN_IN);
        cleanForm();
    },[])

    const login = async () => {
        try{
            const response = await api.login(username, password);
            setCookie(tisaCookie, response, {expired: response.tokenExpiration, path: "/"})
            cleanForm();
            onClose()
        } catch (e) {
            console.error(e);
            toast.error("Invalid credentials")
        }
    }

    const signUp = async () => {
        if(username.length === 0)  {toast.error("Username is not valid"); return;}
        if(password.length === 0)  {toast.error("Password is not valid"); return;}
        if(!validator.isEmail(email))  {toast.error("Email is not valid"); return;}
        try {
            await api.signUp(username,password,email);
            toast.success("YAY! Please Login to your new account");
            setMode(SIGN_IN);
        } catch (e) {
            console.error(e);
            toast.error("Oops, something wasn't right");
        }
    }

    const changeMode = async (newMode) => {
        setMode(newMode);
        cleanForm()
    }

    const cleanForm = () => {
        setUsername("");
        setPassword("");
        setEmail("");
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="login-modal">
                <div className="login-modal-header">
                    <div>{mode}</div>
                </div>
                {mode === SIGN_IN && <div className="login-modal-content">
                    <div style={{width: "100%"}}>
                        <div className="login-input-header">Username</div>
                        <div className="login-input-container">
                            <input value={username} type="text"
                                   onChange={(event) => setUsername(event.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') login()}}/>
                        </div>
                    </div>
                    <div style={{width: "100%", marginTop: "10%"}}>
                        <div className="login-input-header">Password</div>
                        <div className="login-input-container">
                            <input value={password} type="password" onChange={(event) => setPassword(event.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') login()}}/>
                        </div>
                    </div>
                    <div className="login-button-container">
                        <button className="blueButton" style={{width: 200}} onClick={login}>Log In</button>
                    </div>
                    <div className="signup-box">
                        <div>Don't have an account yet?</div>
                        <div className="signup-button" onClick={() => changeMode(SIGN_UP)}>Sign Up</div>
                    </div>
                </div>}
                {mode === SIGN_UP && <div className="login-modal-content">
                    <div style={{width: "100%"}}>
                        <div className="login-input-header">Username</div>
                        <div className="login-input-container">
                            <input value={username} type="text" onChange={(event) => setUsername(event.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') signUp()}}/>
                        </div>
                    </div>
                    <div style={{width: "100%", marginTop: "10%"}}>
                        <div className="login-input-header">Password</div>
                        <div className="login-input-container">
                            <input value={password} type="password" onChange={(event) => setPassword(event.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') signUp()}}/>
                        </div>
                    </div>
                    <div style={{width: "100%", marginTop: "10%"}}>
                        <div className="login-input-header">Email</div>
                        <div className="login-input-container">
                            <input value={email} type="text" onChange={(event) => setEmail(event.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') signUp()}}/>
                        </div>
                    </div>
                    <div className="login-button-container">
                        <button className="blueButton" style={{width: 200}} onClick={signUp}>Sign Up</button>
                    </div>
                    <div className="signup-box" style={{marginTop: 55}}>
                        <div>Already have an account?</div>
                        <div className="signup-button" onClick={() => changeMode(SIGN_IN)}>Sign In</div>
                    </div>
                </div>}
            </div>
        </Modal>
    );
}

export default LoginModal;
