import { useState } from "react";

function ChangePassword() {
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/users/password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: password
            })
        });
        setPassword("");
    }

    return ( 
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Enter your new password</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="email">New password</label>
                                    <input type="password" name="password" value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <button onClick={handleSubmit}>Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ChangePassword;