import { useState } from "react";
import { useLocation } from 'react-router-dom';

function Payment() {

    const location = useLocation();
    const stateData = location.state ? location.state : null;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [parText, setParText] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cardNumber, setCardNumber] = useState("");
    const [expDate, setExpDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [price, setPrice] = useState(stateData.price);





    const handleSubmit = () => {

    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create your account</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <div className="grid--50-50">
                                        <label htmlFor="first">first name</label>
                                    </div>
                                    <input type="text" name="first" value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="lastName">last name</label>
                                    <input type="text" name="lastName" value={lastName}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
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
                                    <label htmlFor="quantity">quantity</label>
                                    <input type="number" name="quantity" value={quantity}
                                        min='1' max='10'
                                        onChange={(e) => {
                                            setQuantity(e.target.value);
                                            setPrice(e.target.value * stateData.price);
                                        }} />

                                </div>
                                <div>
                                    <label htmlFor="cardNumber">Card Number:</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(event) => setCardNumber(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="expDate">Expiration Date:</label>
                                    <input
                                        type="text"
                                        id="expDate"
                                        value={expDate}
                                        onChange={(event) => setExpDate(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cvv">CVV:</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={cvv}
                                        onChange={(event) => setCvv(event.target.value)}
                                    />
                                </div>

                                <div className="field padding-bottom--24">
                                    <p>Price: {price}$</p>
                                    <p style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                    <button onClick={handleSubmit}>pay</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;