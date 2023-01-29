import { useEffect, useState } from 'react';

function Flights() {
    const [flights, setFlights] = useState([]);
    useEffect(() => {
        getFlights();
    }, []);
    async function getFlights() {
        const response = await fetch(`http://localhost:8080/companies/data/flights`);
        const data = await response.json();
        setFlights(data);
    }

    return (
        <div>
            {flights.map(flight => {
                return <p>Airline:{flight.airline} Flight-Date:{flight.flightDate} Start-Location:{flight.startLocation} Destination:{flight.destination} Departure-Time:{flight.departure} Arriving-Time:{flight.arriving} Price:{flight.price}</p>;
            })}
        </div>
    );
}

export default Flights;