import {useEffect} from 'react';

function Hotels() {
    const [flights, setFlights] = useState([]);
    useEffect(() => {
       
    },[])
    async function getHotels() {
        const response = await fetch(`http://localhost:8080/companies/data/flights`);
        const data = await response.json();
        setFlights(data);
    }

    return ( 
        <div>
            {flights.map(flight =>{
            <p>{flight.name}</p>
            })}
        </div>
     );
}

export default Hotels;