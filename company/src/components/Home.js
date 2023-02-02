import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import '../css/Home.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../context/permissionContext";

function Home() {
    const { permission } = usePermission();
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
            {permission === "admin" ? <h1 id='companyDealsTitle'>Companies Info</h1> :
                <h1 id='companyDealsTitle'>Your deals</h1>}
            {permission === "admin" ? deals?.map((company) => {
                return <div className="comapnyDealDiv" key={Math.random()}>
                    <p>Company Name: {company.companyName}</p>
                    <p>Total deals quantity: {company.totalQuantity}</p>
                    <p> Total deals sales: {company.totalPrice}$</p>
                </div>;
            }) : deals?.map((deal) => {
                return <div className="comapnyDealDiv" key={Math.random()}>
                    <p>Deal Id: {deal.dealId}</p>
                    <p> Quantity: {deal.quantity}</p>
                    <p> Total sales: {deal.price}$</p>
                </div>;
            })}
        </div>
    );
}

export default Home;