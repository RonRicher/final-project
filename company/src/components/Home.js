import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import '../css/Home.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    useEffect(() => {

        getCompanyDeals();

    }, []);
    const getCompanyDeals = async () => {
        const response = await fetch(`http://localhost:8080/companies/data`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data);
        setDeals(data);
    };
    return (
        <div id="home-div">
            <NavBar />
            <h1 id='companyDealsTitle'>Your deals</h1>
            {deals?.map((deal) => {
                return <div className="comapnyDealDiv" key={Math.random()}>
                    <p>Deal Id : {deal.dealId}</p>
                    <p>Reservations quantity: {deal.quantity}</p>
                </div>;
            })}
        </div>
    );
}

export default Home;