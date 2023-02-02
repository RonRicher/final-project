import { useEffect, useState } from 'react';

function Hotels() {
    const [hotels, setHotels] = useState([]);
    useEffect(() => {
        getHotels();
    }, []);
    async function getHotels() {
        const response = await fetch(`http://localhost:8080/companies/data/hotels`);

        const data = await response.json();
        console.log(data);
        setHotels(data);
    }

    return (


        <>{hotels ? JSON.stringify(hotels) : null}</>
    );
}

export default Hotels;