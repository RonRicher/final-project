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

        <>{flights ? JSON.stringify(flights) : null}</>
    );
}

export default Flights;