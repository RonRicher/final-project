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
        // navigate('/search/deals', { state: { location, type, startDate, endDate } });
    };

    return (

        <div>
            <div className="header-search">
                <h3 className="main-title">Find your next Deal</h3>
                <p className="sub-title">Search deals by location or type of trip..</p>
            </div>
            <div className="searchComp">
                <div>
                    <input className="search-box" placeholder='Where are you going?' type="search" value={locationSearch} onChange={(e) => {
                        setLocationSearch(e.target.value);
                        clearTimeout(aa.current);
                        aa.current = setTimeout(() => getLocations(e.target.value), 500);
                    }
                    } />
                    <ul className="select">
                        {locationSelect?.map((item) => {
                            return locationFlag ? <li key={Math.random()} onClick={() => {
                                setLocation(item);
                                setLocationFlag(false);

                            }}>{item}</li> : null;
                        })}
                    </ul>

                </div>
                <div className="dates">

                    <input className="date" type="date" onChange={(e) => setStartDate(e.target.value)} />


                    <input className="date" type="date" onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <select value={type} onChange={(e) => {
                    setType(e.target.value);
                }}>
                    <option value="type">type</option>
                    <option value='romantic'>romantic</option>
                    <option value='nature'>nature</option>
                    <option value='urban'>urban</option>
                    <option value='families'>families</option>
                </select>
                <button onClick={() => getSearchDeals(location, type)}>Search</button>
            </div>
        </div>

    );
}

export default Search;