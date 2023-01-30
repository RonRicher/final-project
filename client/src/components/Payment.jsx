import { useState } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
function Payment() {
    const navigate = useNavigate();
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
    const { userId } = useUser();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mathRandom = Math.floor(Math.random() * 100000000);
        const response = await fetch(`http://localhost:8080/users/data/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone: phone,
                email: email,
                firstName: firstName,
                lastName: lastName,
                quantity: quantity,
                clientId: userId * 1,
                dealId: id,
                price: price,
                prevReservations: stateData.reservations,
                random: mathRandom
            })
        });
        const data = await response.json();
        if (data) {
            navigate(`/deals/${id}/payment/confirmation`, { state: { mathRandom, quantity, price, firstName, lastName, email, phone } });
        }
    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Payment</span>
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
                                        min='1' max={stateData.reservations}
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