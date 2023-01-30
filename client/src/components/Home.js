import { useState,useEffect } from "react";
import NavBar from "./NavBar";
import Deal from "./Deal";

function Home() {
    const [deals, setDeals] = useState();
    useEffect(() => {
        getDeals();
    }, []);
    async function getDeals() {
        const response = await fetch(`http://localhost:8080/users/data/deals`);

        const data = await response.json();
        console.log(data);
        setDeals(data);
    }
    return (
        <>
            <NavBar />
            <h1>Home</h1>
            {deals?.map((deal) => {
                return <Deal location={deal.location} startDate={deal.startDate}
                    endDate={deal.endDate} price={deal.price} car={deal.car}
                    description={deal.description} hotelName={deal.hotelName} id={deal.id}/>
            })}
        </>
    );
}

export default Home;