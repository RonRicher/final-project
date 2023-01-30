import { useRef } from "react";
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
    const [quantity, setQuantity] = useState(20);
    const [locationSelect, setLocationSelect] = useState([]);
    const [secondFlights, setSecondFlights] = useState([]);
    const [flag,setFlag] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const aa = useRef();
    const [parText, setParText] = useState("");
    const [firstFlights, setFirstFlights] = useState([]);
    const [hotels, setHotels] = useState([]);

    const getLocations = async (value) => {
        const response = await fetch(`http://localhost:8080/companies/data/search/location?search=${value}`);
        const data = await response.json();
        console.log(data);
        setLocationSelect(data);
        setLocation('');
    };

    const browse = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/companies/data/search/hotels?location=${location}`);
        const data = await response.json();
        // setFirstFlights(data[0]);
        setHotels(data);
        console.log(data);
        const flightResponse = await fetch(`http://localhost:8080/companies/data/search/flights/outbound?location=${location}`);
        const data1 = await flightResponse.json();
        setFirstFlights(data1);
       setFlag(true);
    };

    const getInboundFlights = async(flightId) => {
        const flightResponse = await fetch(`http://localhost:8080/companies/data/search/flights/inbound?location=${location}&flightId=${flightId}`);
        const data= await flightResponse.json();
        console.log(data);
        setSecondFlights(data);
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            hotelId,outbound,location,inbound
        })
        // const response = await fetch(`http://localhost:8080/companies/deals`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         companyId: companyId,
        //         hotelId: hotelId,
        //         location: location,
        //         startDate: startDate,
        //         endDate: endDate,
        //         outboundFlightId: outbound,
        //         inboundFlightId: inbound,
        //         price: price,
        //         car: car ? 1 : 0,
        //         description: description,
        //         reservations: quantity
        //     })
        // });
        // const data = await response.json();
        // if (data) {
        //     setParText('You have successfully registered');
        //     setTimeout(() => {
        //     }, 2000);
        // }
    };
    return (


        <div className="login-root">
            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                <div className="formbg-outer">
                    <div className="formbg">
                        <div className="formbg-inner padding-horizontal--48">
                            <span className="padding-bottom--15">Create New Deal</span>
                            <form id="stripe-login">
                                <p>search</p>
                                <input placeholder='location' type="search" value={locationSearch} onChange={(e) => {
                                    setLocationSearch(e.target.value);
                                    clearTimeout(aa.current);
                                    aa.current = setTimeout(() => getLocations(e.target.value), 500);
                                }
                                } />
                                <div className="field padding-bottom--24">
                                    <select className="" value={location} onChange={(e) => {
                                        setLocation(e.target.value);
                                    }}>
                                        {['select location', ...locationSelect]?.map((item) => {
                                            return <option key={Math.random()} value={item}>{item}</option>;
                                        })}
                                    </select>
                                </div>
                                <button onClick={browse}>Browse</button>
                                {flag?<div><select className="" value={hotelId} onChange={(e) => {
                                    setHotelId(e.target.value);
                                }}>
                                    {['select hotel', ...hotels]?.map((item) => {
                                        return <option key={Math.random()} value={item.hotelId}>{item.hotelName ? `${item.hotelName}` : `${item}`}</option>;
                                    })}
                                </select>
                                <select className="" value={outbound} onChange={(e) => {
                                    console.log(e.target.value);
                                    setOutbound(e.target.value);
                                    getInboundFlights(e.target.value);
                                }}>
                                    {['select outbound-flight', ...firstFlights]?.map((item) => {
                                        return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                    })}
                                </select>
                                <select className="" value={inbound} onChange={(e) => {
                                    console.log(e.target.value);
                                    setInbound(e.target.value);
                                }}>
                                    {['select inbound-flight', ...secondFlights]?.map((item) => {
                                        return <option key={Math.random()} value={item.flightId}>{item.airline ? `${item.airline} , ${item.date}` : `${item}`}</option>;
                                    })}
                                </select>
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
                                    <label htmlFor="quantity">Reservations</label>
                                    <input type="number" name="quantity" value={quantity}
                                        min='20' max='50'
                                        onChange={(e) => {
                                            setQuantity(e.target.value);
                                        }} />

                                </div>
                                <div className="field padding-bottom--24">
                                    <p style={{ margin: '5%', color: 'red' }}>{parText}</p>
                                    <button onClick={handleSubmit}>Deal</button>
                                </div>
                                </div>:null}
                            </form>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default CreateDeal;