import { useRef, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/PersonalTrip.css';

function PersonalTrip() {
    const [location, setLocation] = useState("");
    const [inbound, setInbound] = useState("");
    const [outbound, setOutbound] = useState("");
    const [hotelId, setHotelId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [locationSelect, setLocationSelect] = useState([]);
    const [secondFlights, setSecondFlights] = useState([]);
    const [flag, setFlag] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const textType = useRef();
    const [parText, setParText] = useState("");
    const [firstFlights, setFirstFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [locationFlag, setLocationFlag] = useState(true);
    const [par1Text, setPar1Text] = useState('');
    const navigate = useNavigate();
    const [secondFlightsFlag, setSecondFlightsFlag] = useState(false);
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
        if (data.length === 0) {
            setPar1Text("we d'ont have hotels for this location");
            setTimeout(() => setPar1Text(''), 1500);
            return;
        }
        setHotels(data);
        console.log(data);
        const flightResponse = await fetch(`http://localhost:8080/search/flights/outbound?location=${item}`);
        const data1 = await flightResponse.json();
        if (data1.length === 0) {
            setPar1Text("we d'ont have outbound flight for this location");
            setTimeout(() => setPar1Text(''), 1500);
            return;
        }
        setFirstFlights(data1);
        setFlag(true);
    };

    const getInboundFlights = async (flightId) => {
        console.log(typeof flightId);
        if (!flightId || typeof Number(flightId) !== 'number' || flightId === 'select outbound-flight') {
            setParText('Please choose outbound flight');
            return;
        }
        console.log("fetched outbound");
        const flightResponse = await fetch(`http://localhost:8080/search/flights/inbound?location=${location}&flightId=${flightId}`);
        const data = await flightResponse.json();
        console.log(data);
        setSecondFlights(data);
    };

    const totalPrice = useMemo(() => {
        console.log(firstFlights, outbound, firstFlights.find(flight => flight.flightId === outbound * 1));
        const hotelPrice = hotels.find(hotel => hotel.hotelId === hotelId * 1)?.price * 1 || 0;
        const outboundPrice = firstFlights.find(flight => flight.flightId === outbound * 1)?.price || 0;
        const inboundPrice = secondFlights.find(flight => flight.flightId === inbound * 1)?.price || 0;
        return hotelPrice + inboundPrice + outboundPrice;
    }, [hotelId, inbound, outbound]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(outbound, inbound);
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
        const response = await fetch(`http://localhost:8080/users/deals`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hotelId,
                location,
                outbound,
                inbound,
                quantity
            })
        });
        if (response.status !== 200) {
            const data = await response.json();
            setParText(data);
            return;
        }
        navigate('/personal/trip/payment', { state: { price: totalPrice * quantity, location, quantity, outbound, inbound, hotelId } });
    };
    return (
        <div id="create-deal-div">
            <div className="login-root">
                <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <form id="stripe-login">
                                    {!flag ? <div><p>Choose Location</p><div className="field padding-bottom--24">
                                        <input placeholder='location' type="search" value={locationSearch} onChange={(e) => {
                                            setLocationSearch(e.target.value);
                                            clearTimeout(textType.current);
                                            textType.current = setTimeout(() => getLocations(e.target.value), 200);
                                        }
                                        } />
                                        <p className="parText" style={{ color: 'red' }}>{par1Text}</p>
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
                                            <span className="">Plan your trip</span>
                                            <p onClick={() => {
                                                setFlag(false);
                                                setSecondFlightsFlag(false);
                                            }} id='change-location'>&larr;</p>
                                        </div>
                                        <div>
                                            <select className="personalSelect" value={hotelId} onChange={(e) => {
                                                console.log(e.target, e.target.value);
                                                setHotelId(e.target.value);
                                            }}>
                                                {['select hotel', ...hotels]?.map((item) => {
                                                    return <option key={Math.random()} value={item.hotelId}>{item.hotelName ? `${item.hotelName} , Rooms left: ${item.reservations}, ${item.price}$` : `${item}`}</option>;
                                                })}
                                            </select>
                                        </div>
                                        <div>
                                            <select className="personalSelect" value={outbound} onChange={(e) => {
                                                { e.target.value !== 'select outbound-flight' ? setOutbound(e.target.value) : setOutbound(''); };
                                                getInboundFlights(e.target.value);
                                                setSecondFlightsFlag(true);
                                            }}>
                                                {['select outbound-flight', ...firstFlights]?.map((item) => {
                                                    return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}, ${item.price}$` : `${item}`}</option>;
                                                })}
                                            </select>
                                        </div>
                                        {secondFlightsFlag ? <div>
                                            <select className="personalSelect" value={inbound} onChange={(e) => {
                                                console.log(e.target.value);
                                                setInbound(e.target.value);
                                            }}>
                                                {['select inbound-flight', ...secondFlights]?.map((item) => {
                                                    return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date} , ${item.price}$` : `${item}`}</option>;
                                                })}
                                            </select>
                                        </div> : null}
                                        <div className="field padding-bottom--24">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" name="quantity" value={quantity}
                                                min='1' max='10'
                                                onChange={(e) => {
                                                    setQuantity(e.target.value);
                                                }} />
                                        </div>
                                        <div className="field padding-bottom--24">
                                            <p className='parText' style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                            <p id="price">{totalPrice * quantity}$</p>
                                            <button className="proceedBtn" onClick={handleSubmit}> Proceed to Payment</button>
                                        </div>
                                    </div> : null}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalTrip;