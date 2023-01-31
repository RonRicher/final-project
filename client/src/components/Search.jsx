import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Search() {

    const [locationSelect, setLocationSelect] = useState([]);
    const [locationSearch, setLocationSearch] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [locationFlag, setLocationFlag] = useState(true);
    const [type, setType] = useState("");
    const aa = useRef();
    const navigate = useNavigate();


    const getLocations = async (value) => {

        const response = await fetch(`http://localhost:8080/users/data/search/location?search=${value}`);
        const data = await response.json();
        console.log(data);
        setLocationSelect(data);
        setLocation('');
    };

    const getSearchDeals = async (location, type) => {
        console.log(location);
        navigate('/search/deals', { state: { location, type, startDate, endDate } });
    };

    return (

        <div>
            <div className="header-search">
                <h3 className="main-title">Find your next Deal</h3>
                <p className="sub-title">Search deals by location or type of trip..</p>
            </div>
            <div className="searchComp">

                <div className="select-location">
                    <input className="search-box" placeholder='Where are you going?' type="search" value={locationSearch} onChange={(e) => {
                        setLocationSearch(e.target.value);
                        clearTimeout(aa.current);
                        setLocationFlag(true);
                        aa.current = setTimeout(() => getLocations(e.target.value), 500);
                    }
                    } />
                    <ul className="select">
                        {locationSelect?.map((item) => {
                            return locationFlag ? <li className="option" key={Math.random()} onClick={() => {
                                setLocation(item);
                                setLocationSearch(item);
                                setLocationFlag(false);

                            }}>&#x1F4CD;&nbsp;&nbsp;&nbsp;&nbsp;{item}</li> : null;
                        })}
                    </ul>
                </div>
                <div className="dates">

                    <input className="date" type="date" onChange={(e) => setStartDate(e.target.value)} />


                    <input className="date" type="date" onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="types">
                    <select id="type" value={type} onChange={(e) => {
                        setType(e.target.value);
                    }}>
                        <option id="wow" className="typeList" value='romantic'>romantic</option>
                        <option className="typeList" value='nature'>nature</option>
                        <option className="typeList" value='urban'>urban</option>
                        <option className="typeList" value='families'>families</option>
                        <option className="typeList" value="type">type</option>
                    </select>
                </div>
                <button id='clickDeals' onClick={() => getSearchDeals(location, type)}>Search</button>
            </div>
        </div >

    );
}

export default Search;