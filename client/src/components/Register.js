import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LogIn.css";

function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [parText, setParText] = useState("");
    const [exit, setExit] = useState(false);
    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    const phoneRegex = /^(?:\+\d{1,3}|0\d{1,3}|\d{1,4})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    

    useEffect(()=>{
        setParText("");
    },[exit]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameRegex.test(username)) {
          setParText("Please enter a valid username");
            return;
        }else if (!passwordRegex.test(password)) {
           setParText("Please enter a valid password");
            return;
        }else if(!emailRegex.test(email)) {
           setParText("Please enter a valid email address");
            return;
        }else if(!phoneRegex.test(phone)) {
           setParText("Please enter a valid phone number");
            return;
        }
        const response = await fetch(`http://localhost:8080/users/register`, {
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
            props.setFlag(false);
            setEmail('');
            setPassword('');
            setUsername('');
            setPhone('');
            setParText("");
        }
    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <button id="exit" onClick={() => {
                            props.setFlag(false)
                            setExit(true);
                        }}>X</button>
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create your account</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="username">User-Name</label>
                                    <input type="text" name="username" value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
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
                                <p style={{margin:'5%',color:'red'}}>{parText}</p>
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