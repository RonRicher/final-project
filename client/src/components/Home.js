import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Deal from "./Deal";
import Search from "./Search";
import { useUser } from "../context/userContext";

function Home() {
    const [deals, setDeals] = useState();
    const { userId } = useUser();
    console.log(userId);
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

            <Search />
            <h1 className="found">Popular Deals</h1>
            {deals?.map((deal) => {
                return <Deal key={deal.id} location={deal.location} startDate={deal.startDate}
                    endDate={deal.endDate} price={deal.price} car={deal.car}
                    description={deal.description} hotelName={deal.hotelName} id={deal.id} />;
            })}
        </>
    );
}

export default Home;