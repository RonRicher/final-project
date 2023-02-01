import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [parText, setParText] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setParText("Loading...");
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if(!passwordRegex.test(password)){
            setParText('The password must contain at least 1 letter and 1 number');
            return;
        } 
            const response = await fetch(`http://localhost:8080/users/changePassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: password,
                    email: email
                })
            });
          if(response.status !== 200){
            setParText('We do not have this email in our system'); 
            return;
          }
                setParText('Password changed successfully, now you can login')
               setTimeout(() => navigate('/'), 2000)  
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
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            console.log(email);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="email">New password</label>
                                    <input type="password" name="password" value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <p style={{margin:'5%',color:'red'}}>{parText}</p>
                                    <button onClick={handleSubmit}>Change Password</button>
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