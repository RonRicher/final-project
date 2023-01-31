import { useRef,useMemo,useState } from "react";
import '../css/PersonalTrip.css'

function PersonalTrip() {
    const [price, setPrice] = useState(0);
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

    const getLocations = async (value) => {
        const response = await fetch(`http://localhost:8080/search/location?search=${value}`);
        const data = await response.json();
        console.log(data);
        setLocationSelect(data);
        setLocation('');
    };

    const browse = async (item) => {
        console.log(location)
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
        const flightResponse = await fetch(`http://localhost:8080/search/flights/inbound?location=${location}&flightId=${flightId}`);
        const data = await flightResponse.json();
        console.log(data);
        setSecondFlights(data);
    }

    const totalPrice = useMemo(()=> {
        console.log(firstFlights, outbound,firstFlights.find(flight=>flight.flightId === outbound * 1 ))
       const hotelPrice = hotels.find(hotel=>hotel.hotelId === hotelId * 1)?.price * 1 || 0;
       const outboundPrice = firstFlights.find(flight=>flight.flightId === outbound * 1 )?.price|| 0;
       const inboundPrice = secondFlights.find(flight=>flight.flightId === inbound * 1)?.price || 0;
       return hotelPrice + inboundPrice + outboundPrice; 
    },[hotelId,inbound,outbound])


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            hotelId, outbound, location, inbound, quantity
        })
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
        })
        const data = await response.json();
    }
    return (
        <div id="create-deal-div">
            <div className="login-root">
                <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <span className="padding-bottom--15">Create New Deal</span>
                                <form id="stripe-login">
                                   {!flag?  <div><p>Choose Location</p><div className="field padding-bottom--24">
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
                                                return <li key={Math.random()} className='option' onClick={()=> {
                                                    setLocation(item);
                                                    setLocationFlag(false);
                                                    browse(item);
                                                 }}>&#x1F4CD;&nbsp;&nbsp;&nbsp;&nbsp;{item}</li>;
                                            })}
                                        </ul>
                                    </div></div>:null} 
                                    {flag ? <div>
                                        <button onClick={()=> setFlag(false)} id='change-location'>change location</button>
                                        <div>
                                        <select className="" value={hotelId} onChange={(e) => {
                                            console.log(e.target,e.target.value);
                                        setHotelId(e.target.value);
                                    }}>
                                        {['select hotel', ...hotels]?.map((item) => {
                                            return <option key={Math.random()} data-price={`${item.price}`} value={item.hotelId}>{item.hotelName ? `${item.hotelName} , ${item.price}` : `${item}`}</option>;
                                        })}
                                    </select>
                                    </div>
                                    <div>
                                        <select className="" value={outbound} onChange={(e) => {
                                            console.log(e.target.value);
                                            setOutbound(e.target.value);
                                            getInboundFlights(e.target.value);
                                        }}>
                                            {['select outbound-flight', ...firstFlights]?.map((item) => {
                                                return <option key={Math.random()}  value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                            })}
                                        </select>
                                        </div>
                                        <div>
                                        <select className="" value={inbound} onChange={(e) => {
                                            console.log(e.target.value);
                                            setInbound(e.target.value);
                                        }}>
                                            {['select inbound-flight', ...secondFlights]?.map((item) => {
                                                return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                            })}
                                        </select>
                                        </div>
                                        <div className="field padding-bottom--24">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" name="quantity" value={quantity}
                                                min='1' max='10'
                                                onChange={(e) => {
                                                    setQuantity(e.target.value);
                                                }} />
                                        </div>
                                        <div className="field padding-bottom--24">
                                            <p style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                            <p>{totalPrice * quantity}$</p>
                                            <button onClick={handleSubmit}>Deal</button>
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