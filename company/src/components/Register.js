import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LogIn.css";

function Register(props) {
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [parText, setParText] = useState("");
    const [exit, setExit] = useState(false);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const companyNameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    const phoneRegex = /^(?:\+\d{1,3}|0\d{1,3}|\d{1,4})[\s.-]?\d{3}[\s.-]?\d{4}$/;


    useEffect(() => {
        setParText("");
    }, [exit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyNameRegex.test(companyName)) {
            setParText("Please enter a valid company name");
            return;
        }
        else if (location === "") {
            setParText("Please enter your company location");
            return;
        }
        else if (!passwordRegex.test(password)) {
            setParText("Please enter a valid password");
            return;
        } else if (!emailRegex.test(email)) {
            setParText("Please enter a valid email address");
            return;
        } else if (!phoneRegex.test(phone)) {
            setParText("Please enter a valid phone number");
            return;
        }
        const response = await fetch(`http://localhost:8080/companies/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                companyName: companyName,
                password: password,
                phone: phone,
                email: email,
                location: location
            })
        });
        if (response.status !== 200) {
            const data = await response.json();
            setParText(data)
            return;
        }
        setParText('You have successfully registered');
        setTimeout(() => {
            props.setFlag(false);
            setEmail('');
            setPassword('');
            setCompanyName('');
            setPhone('');
        }, 2000)
    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <button id="exit" onClick={() => {
                            props.setFlag(false);
                            setExit(true);
                        }}>X</button>
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create your account</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="company">Company-Name</label>
                                    <input type="text" name="company" value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <div className="grid--50-50">
                                        <label htmlFor="location">Location</label>
                                    </div>
                                    <input type="text" name="location" value={location}
                                        onChange={(e) => {
                                            setLocation(e.target.value);
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
                                    <p className='parText' style={{ margin: '5%', color: 'red' }}>{parText}</p>
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