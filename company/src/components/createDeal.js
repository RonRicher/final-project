import { useState } from "react";

function CreateDeal() {
    const [companyId, setCompanyId] = useState("");
    const [description, setDescription] = useState("");
    const [car, setCar] = useState(false);
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [inbound, setInbound] = useState("");
    const [outbound, setOutbound] = useState("");
    const [hotelId, setHotelId] = useState("");


    const [parText, setParText] = useState("");
    const [exit, setExit] = useState(false);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    const phoneRegex = /^(?:\+\d{1,3}|0\d{1,3}|\d{1,4})[\s.-]?\d{3}[\s.-]?\d{4}$/;


    // useEffect(() => {
    //     setParText("");
    // }, [exit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/companies/deals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                companyId: companyId,
                hotelId: hotelId,
                location: location,
                startDate: startDate,
                endDate: endDate,
                outboundFlightId: outbound,
                inboundFlightId: inbound,
                price: price,
                car: car ? 1 : 0,
                description: description
            })
        });
        const data = await response.json();
        if (data) {
            setParText('You have successfully registered');
            setTimeout(() => {
            }, 2000);
        }
    };
    return (
        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create New Deal</span>
                            <form id="stripe-login">
                                <div className="field padding-bottom--24">
                                    <label htmlFor="companyId">Company-id</label>
                                    <input type="text" name="companyId" value={companyId}
                                        onChange={(e) => {
                                            setCompanyId(e.target.value);
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
                                        <label htmlFor="hotelId">hotel-id</label>
                                    </div>
                                    <input type="text" name="hotelId" value={hotelId}
                                        onChange={(e) => {
                                            setHotelId(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="outbound">outbound-flight</label>
                                    <input type="text" name="outbound" value={outbound}
                                        onChange={(e) => {
                                            setOutbound(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="inbound">inbound-flight</label>
                                    <input type="text" name="inbound" value={inbound}
                                        onChange={(e) => {
                                            setInbound(e.target.value);
                                        }} />
                                </div>
                                <div>
                                    <label>Start Date:</label>
                                    <input type="date" onChange={(e) => setStartDate(e.target.value)} />

                                    <label>End Date:</label>
                                    <input type="date" onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="price">price</label>
                                    <input type="text" name="price" value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="car">car</label>
                                    <input type="checkBox" name="car" value={car}
                                        onChange={(e) => {
                                            setCar(e.target.checked);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <label htmlFor="description">description</label>
                                    <input type="text" name="description" value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }} />
                                </div>
                                <div className="field padding-bottom--24">
                                    <p style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                    <button onClick={handleSubmit}>Deal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateDeal;