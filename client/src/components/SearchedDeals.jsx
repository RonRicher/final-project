
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Deal from './Deal';
import NavBar from './NavBar';

function SearchedDeals() {
    const siteLocation = useLocation();
    const { location, type, startDate, endDate } = siteLocation.state;
    const [deals, setDeals] = useState([]);



    useEffect(() => {
        getDeals(location, type, startDate, endDate);
    }, []);

    const getDeals = async (location, type, startDate, endDate) => {
        const response = await fetch(`http://localhost:8080/users/data/search?location=${location}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setDeals(data);
    };

    return (
        <>
            <NavBar />

            <>
                {deals.length === 0 ?

                    <><h1 class='not-found'>No results founds.</h1></> : <></>

                }</>
            {deals?.map((deal) => {
                return <Deal key={Math.random()} location={deal.location} startDate={deal.startDate}
                    endDate={deal.endDate} price={deal.price} car={deal.car}
                    description={deal.description} hotelName={deal.hotelName} id={deal.id} />;
            })}
        </>
    );
}

export default SearchedDeals;