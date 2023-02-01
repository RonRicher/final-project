import { useRef } from "react";
import { useState } from "react";
import '../css/CreateDeal.css';
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function CreateDeal() {
    const [description, setDescription] = useState("");
    const [car, setCar] = useState(false);
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [inbound, setInbound] = useState("");
    const [outbound, setOutbound] = useState("");
    const [hotelId, setHotelId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [locationSelect, setLocationSelect] = useState([]);
    const [secondFlights, setSecondFlights] = useState([]);
    const [flag, setFlag] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const aa = useRef();
    const [parText, setParText] = useState("");
    const [firstFlights, setFirstFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [locationFlag, setLocationFlag] = useState(true);
    const [secondFlightsFlag, setSecondFlightsFlag] = useState(false);
    const navigate = useNavigate();

    const getLocations = async (value) => {
        const response = await fetch(`http://localhost:8080/search/location?search=${value}`);
        const data = await response.json();
        console.log(data);
        setLocationSelect(data);
        setLocation('');
    };

    const browse = async (item) => {
        console.log(location);
        const response = await fetch(`http://localhost:8080/search/hotels?location=${item}`);
        const data = await response.json();
        setHotels(data);
        console.log(data);
        const flightResponse = await fetch(`http://localhost:8080/search/flights/outbound?location=${item}`);
        const data1 = await flightResponse.json();
        setFirstFlights(data1);
        setFlag(true);
    };

    const getInboundFlights = async (flightId) => {
        if (!flightId || typeof Number(flightId) !== 'number' || flightId === 'select outbound-flight') {
            setParText('choose outbound-flight');
            return;
        }
        const flightResponse = await fetch(`http://localhost:8080/search/flights/inbound?location=${location}&flightId=${flightId}`);
        const data = await flightResponse.json();
        console.log(data);
        setSecondFlights(data);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const pattern = /^.{30,100}$/;
        if (location === '') {
            setParText('Please choose location');
            return;
        }
        if (hotelId === '' || hotelId === 'select hotel') {
            setParText('Please choose hotel');
            return;
        }
        if (!outbound || typeof Number(outbound) !== 'number') {
            setParText('Please choose outbound flight');
            return;
        }
        if (!inbound || typeof Number(inbound) !== 'number') {
            setParText('Please choose inbound flight');
            return;
        }
        if (price <= 0) {
            setParText('Please enter price');
            return;
        }
        if (!pattern.test(description)) {
            setParText('The description must be between 30 characters to 100 characters');
        }
        const response = await fetch(`http://localhost:8080/companies/deals`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hotelId,
                location,
                outbound,
                inbound,
                price,
                car: car ? 1 : 0,
                description,
                reservations: quantity
            })
        });
     if(response.status !== 200){
        const data = await response.json();
        setParText(data);
        return;
     }
            setParText('You have successfully created a new deal');
            setTimeout(() => {
                navigate('/home');
            }, 1500);
    };
    return (

        <div id="create-deal-div">
            <NavBar />
            <div className="login-root">
                <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <div id="paymentForm">

                                    <form id="stripe-login">
                                        {!flag ? <div><div className="field padding-bottom--24">
                                            <span className="padding-bottom--15">Create New Deal</span>
                                            <input placeholder='location' type="search" value={locationSearch} onChange={(e) => {
                                                setLocationSearch(e.target.value);
                                                clearTimeout(aa.current);
                                                aa.current = setTimeout(() => getLocations(e.target.value), 200);
                                            }
                                            } />
                                        </div>
                                            <div className="field padding-bottom--24 select-location">
                                                <ul className="select">
                                                    {locationSelect?.map((item) => {
                                                        return <li key={Math.random()} className='option' onClick={() => {
                                                            setLocation(item);
                                                            setLocationFlag(false);
                                                            browse(item);
                                                        }}>&#x1F4CD;&nbsp;&nbsp;&nbsp;&nbsp;{item}</li>;
                                                    })}
                                                </ul>
                                            </div></div> : null}
                                        {flag ? <div>
                                            <div className="flexTitleButton">
                                                <span className="">Create New Deal</span>
                                                <p onClick={() => {
                                                    setFlag(false);
                                                    setSecondFlightsFlag(false);
                                                    setInbound("");
                                                    setOutbound("");
                                                    setHotelId("");
                                                    setPrice("");
                                                    setDescription("");
                                                    setCar(false);
                                                }} id='change-location'>&larr;</p>
                                            </div>
                                            <div>
                                                <select value={hotelId} onChange={(e) => {
                                                    setHotelId(e.target.value);
                                                }}>
                                                    {['select hotel', ...hotels]?.map((item) => {
                                                        return <option key={Math.random()} value={item.hotelId}>{item.hotelName ? `${item.hotelName}, Rooms left: ${item.reservations}` : `${item}`}</option>;
                                                    })}
                                                </select>
                                            </div>
                                            <div>
                                                <select value={outbound} onChange={(e) => {
                                                    setOutbound(e.target.value);
                                                    getInboundFlights(e.target.value);
                                                    setSecondFlightsFlag(true);
                                                }}>
                                                    {['select outbound-flight', ...firstFlights]?.map((item) => {
                                                        return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                                    })}
                                                </select>
                                            </div>
                                            {secondFlightsFlag ? <div>
                                                <select value={inbound} onChange={(e) => {
                                                    setInbound(e.target.value);
                                                }}>
                                                    {['select inbound-flight', ...secondFlights]?.map((item) => {
                                                        return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                                    })}
                                                </select>
                                            </div> : null}
                                            <div className="field padding-bottom--24">
                                                <label htmlFor="price">Price</label>
                                                <input type="text" name="price" value={price}
                                                    onChange={(e) => {
                                                        setPrice(e.target.value);
                                                    }} />
                                            </div>
                                            <div className="carCheck padding-bottom--24">
                                                <label htmlFor="car">Car</label>
                                                <input type="checkBox" id='carInput' name="car" value={car}
                                                    onChange={(e) => {
                                                        setCar(e.target.checked);
                                                    }} />
                                            </div>
                                            <div className="field padding-bottom--24">
                                                <label htmlFor="description">Description</label>
                                                <input type="text" name="description" id="text-area" value={description}
                                                    onChange={(e) => {
                                                        setDescription(e.target.value);
                                                    }} />
                                            </div>
                                            <div className="field padding-bottom--24">
                                                <label htmlFor="quantity">Reservations</label>
                                                <input type="number" name="quantity" value={quantity}
                                                    min='1' max='50'
                                                    onChange={(e) => {
                                                        setQuantity(e.target.value);
                                                    }} />

                                            </div>
                                            <div className="field padding-bottom--24">
                                                <p className="parText" style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                                <button onClick={handleSubmit}>Create Deal</button>
                                            </div>
                                        </div> : null}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CreateDeal;