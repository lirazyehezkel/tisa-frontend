import React, {useState} from 'react';
import Modal from "@material-ui/core/Modal";
import './LoginModal.css';

const LoginModal = ({isOpen, onClose}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="login-modal">
                <div className="login-modal-header">
                    <div>Sign In</div>
                </div>
                <div className="login-modal-content">
                    <div style={{width: "100%"}}>
                        <div className="login-input-header">Username</div>
                        <div className="login-input-container"><input value={username} type="text" onChange={(event) => setUsername(event.target.value)}/></div>
                    </div>
                    <div style={{width: "100%", marginTop: "10%"}}>
                        <div className="login-input-header">Password</div>
                        <div className="login-input-container"><input value={password} type="password" onChange={(event) => setPassword(event.target.value)}/></div>
                    </div>
                    <div className="login-button-container">
                        <button className="blueButton" style={{width: 200}}>Log In</button>
                    </div>
                    <div className="signup-box">
                        <div>Don't have an account yet?</div>
                        <div className="signup-button">Sign Up</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default LoginModal;
