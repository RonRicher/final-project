import {useEffect} from 'react';

function Hotels() {
    const [hotels, setHotels] = useState([]);
    useEffect(() => {
       getHotels();
    },[])
    async function getHotels() {
        const response = await fetch(`http://localhost:8080/companies/data/hotels`);
        const data = await response.json();
        setHotels(data);
    }

    return ( 
        <div>
            {hotels?.map(hotel =>{
            <p>{hotel.name}</p>
            })}
        </div>
     );
}

export default Hotels;