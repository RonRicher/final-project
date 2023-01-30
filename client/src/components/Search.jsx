import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Search() {

    const [locationSelect, setLocationSelect] = useState([]);
    const [locationSearch, setLocationSearch] = useState("");
    const [location, setLocation] = useState("");
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
        navigate('/search/deals', { state: { location, type } });
    };

    return (

        <div>
            <p>search</p>
            <input placeholder='location' type="search" value={locationSearch} onChange={(e) => {
                setLocationSearch(e.target.value);
                clearTimeout(aa.current);
                aa.current = setTimeout(() => getLocations(e.target.value), 500);
            }
            } />
            <select className="" value={location} onChange={(e) => {
                console.log('dsadasd');

                setLocation(e.target.value);
            }}>
                {['select location', ...locationSelect]?.map((item) => {
                    return <option key={Math.random()} value={item}>{item}</option>;
                })}
            </select>

            <select value={type} onChange={(e) => {
                setType(e.target.value);
            }}>
                <option value="type">type</option>
                <option value='romantic'>romantic</option>
                <option value='nature'>nature</option>
                <option value='urban'>urban</option>
                <option value='families'>families</option>
            </select>
            <button onClick={() => getSearchDeals(location, type)}></button>

        </div>

    );
}

export default Search;