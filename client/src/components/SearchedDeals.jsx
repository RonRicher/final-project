
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Deal from './Deal';

function SearchedDeals() {
    const siteLocation = useLocation();
    const { location, type } = siteLocation.state;
    const [deals, setDeals] = useState([]);



    useEffect(() => {
        getDeals(location, type);
    }, []);
    const getDeals = async (location, type) => {
        const response = await fetch(`http://localhost:8080/users/data/search?location=${location}&type=${type}`);
        const data = await response.json();
        setDeals(data);
    };

    return (
        <>
            {deals?.map((deal) => {
                return <Deal key={Math.random()} location={deal.location} startDate={deal.startDate}
                    endDate={deal.endDate} price={deal.price} car={deal.car}
                    description={deal.description} hotelName={deal.hotelName} id={deal.id} />;
            })}
        </>
    );
}

export default SearchedDeals;