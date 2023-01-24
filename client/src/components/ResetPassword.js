import { useState } from "react";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/users/password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email
            })
        });
        setEmail("");
    }

    return ( 
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Enter your email address</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            console.log(email);
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

export default ResetPassword;