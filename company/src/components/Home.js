import { useEffect, useState } from "react";
import NavBar from "./NavBar";

function Home() {
    const [deals,setDeals] = useState([]);
    useEffect(()=>{
        getCompanyDeals();
    },[])
    const getCompanyDeals = async()=>{
        const response = await fetch(`http://localhost:8080/companies/data`,{
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data);
        setDeals(data);
    }
    return (
        <>
            <NavBar />
            <h1>Home</h1>
            <h2>Your deals</h2>
            {deals?.map((deal)=>{
                return <div key={Math.random()}>
                    <p>deal id : {deal.dealId}</p>
                    <p>quantity: {deal.quantity}</p>
                </div>
            })}
        </>
    );
}

export default Home;