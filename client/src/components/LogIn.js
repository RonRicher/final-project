import {useNavigate} from "react-router-dom"
import { useState } from "react";

import "../css/LogIn.css" 

function LogIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const response = await fetch(`http://localhost:8080/users`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         username: username,
        //         password: password,
        //     })
        // });
        // const data = await response.json();
        // if (data) {
        //     console.log(data);
        //     navigate(`users/${username}`)
        // }
    };
    return (
        <div className="login-root">
            <div className="box-root flex-flex flex-direction--column" style={{ minHeight: "100vh", flexGrow: 1 }}>
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
                        <h1><a href="http://blog.stackfindover.com/" rel="dofollow">Login</a></h1>
                    </div>
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <span className="padding-bottom--15">Sign in to your account</span>
                                <form id="stripe-login">
                                    <div className="field padding-bottom--24">
                                        <label htmlFor="username">User-Name</label>
                                        <input type="text" name="username" value={username}
                                            onChange={(e) => {setUsername(e.target.value) 
                                            console.log(username)}} />
                                    </div>
                                    <div className="field padding-bottom--24">
                                        <div className="grid--50-50">
                                            <label htmlFor="password">Password</label>
                                            <div className="reset-pass">
                                                <a href="#">Forgot your password?</a>
                                            </div>
                                        </div>
                                        <input type="password" name="password" value={password}
                                            onChange={(e) => {setPassword(e.target.value)
                                                console.log(password)}}/>
                                    </div>
                                    <div className="field field-checkbox padding-bottom--24 flex-flex align-center">
                                        <label htmlFor="checkbox">
                                            <input type="checkbox" name="checkbox" /> Stay signed in for a week
                                        </label>
                                    </div>
                                    <div className="field padding-bottom--24">
                                        <button onClick={handleSubmit}>Continue</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="footer-link padding-top--24">
                            <span>Don't have an account? <a href="">Sign up</a></span>
                            <div className="listing padding-top--24 padding-bottom--24 flex-flex center-center">
                                <span><a href="#">Contact</a></span>
                                <span><a href="#">Privacy & terms</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;