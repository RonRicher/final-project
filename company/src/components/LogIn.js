import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Register from "./Register";
import { usePermission } from '../context/permissionContext';

import "../css/LogIn.css";

function LogIn() {
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");
    const [flag, setFlag] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [parText, setParText] = useState("");
    const navigate = useNavigate();
    const { setPermission } = usePermission();

    useEffect(() => {
        if (Cookies.get('userName')) {
            navigate('/home');
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/companies/logIn`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                companyName: companyName,
                password: password
            })
        });
        const data = await response.json();
        if (response.status !== 200) {

            setParText(data);
            return;
        }
        setPermission(data);
        localStorage.setItem('permission', JSON.stringify(data));
        navigate('/home');
    };
    return (
        <div className="login-root">
            <div className="box-root flex-flex flex-direction--column" style={flag ? { minHeight: "100vh", flexGrow: 1, opacity: 0.3 } : { minHeight: "100vh", flexGrow: 1, opacity: 1 }}>
                <div className="loginbackground box-background--white padding-top--64">
                    <div className="loginbackground-gridContainer">
                        <div className="box-root flex-flex" style={{ gridArea: "top / start / 8 / end" }}>
                            <div className="box-root" style={{
                                backgroundImage: "linear-gradient(white 0%, rgb(247, 250, 252) 33%)", flexGrow: 1
                            }}>
                            </div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: "4 / 2 / auto / 5" }}>
                            <div className="box-root box-divider--light-all-2 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '6 / start / auto / 2' }}>
                            <div className="box-root box-background--blue800" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '7 / start / auto / 4' }}>
                            <div className="box-root box-background--blue animationLeftRight" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '8 / 4 / auto / 6' }}>
                            <div className="box-root box-background--gray100 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '2 / 15 / auto / end' }}>
                            <div className="box-root box-background--cyan200 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '3 / 14 / auto / end' }}>
                            <div className="box-root box-background--blue animationRightLeft" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '4 / 17 / auto / 20' }}>
                            <div className="box-root box-background--gray100 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className="box-root flex-flex" style={{ gridArea: '5 / 14 / auto / 17' }}>
                            <div className="box-root box-divider--light-all-2 animationRightLeft tans3s" style={{ flexGrow: 1 }}></div>
                        </div>
                    </div>
                </div>
                <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                    <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
                        <h1>Login</h1>
                    </div>
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <span className="padding-bottom--15">Sign in to your account</span>
                                <form id="stripe-login">
                                    <div className="field padding-bottom--24">
                                        <label htmlFor="username">User-Name</label>
                                        <input type="text" name="username" value={companyName}
                                            onChange={(e) => {
                                                setCompanyName(e.target.value);
                                                console.log(companyName);
                                            }} />
                                    </div>
                                    <div className="field padding-bottom--24">
                                        <div className="grid--50-50">
                                            <label htmlFor="password">Password</label>
                                            <div className="reset-pass">
                                                <a href="/password">Forgot your password?</a>
                                            </div>
                                        </div>
                                        <input type="password" name="password" value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                console.log(password);
                                            }} />
                                    </div>
                                    <div className="field padding-bottom--24">
                                        <p className="parText" style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                        <button onClick={handleSubmit}>LogIn</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="footer-link padding-top--24">
                            <span>Don't have an account? <a onClick={() => setFlag(true)}>Sign up</a></span>
                            <div className="listing padding-top--24 padding-bottom--24 flex-flex center-center">
                                <span><a href="#">Contact</a></span>
                                <span><a href="#">Privacy & terms</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="register" style={flag ? { display: "block" } : { display: "none" }}> <Register setFlag={setFlag} /></div>
        </div>
    );
}

export default LogIn;