import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LogIn.css";

function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password,
                phone: phone,
                email: email
            })
        });
        const data = await response.json();
        if (data) {
            navigate('/')
        }
    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <button id="exit" onClick={() => props.setFlag(false)}>X</button>
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create your account</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="username">User-Name</label>
                                    <input type="text" name="username" value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            console.log(username);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <div className="grid--50-50">
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <input type="password" name="password" value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            console.log(password);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            console.log(email);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="phone">Phone number</label>
                                    <input type="text" name="phone" value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            console.log(phone);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <button onClick={handleSubmit}>Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;