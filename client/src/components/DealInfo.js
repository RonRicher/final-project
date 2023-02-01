import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function DealInfo() {
    const [info, setInfo] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        getInfo();
    }, []);
    async function getInfo() {
        const response = await fetch(`http://localhost:8080/users/data/dealInfo?dealId=${id}`);
        const data = await response.json();
        console.log(data);
        setInfo(data);
    }
    const goToPayment = () => {
        navigate(`../../deals/${id}/payment`, {
            state: {
                price: info[0]?.price,
                description: info[0]?.description,
                reservations: info[0]?.reservations,
                location: info[0]?.location
            }
        });
    };
    return (
        <div>
            <NavBar />
            <div className="dealInfo">
                <div>
                    <div className="header-deal">
                        <h2 className="dealInfoTitle">Book Your next Trip to {info[0]?.location}!</h2>
                        <p>{info[0]?.startDate} - {info[0]?.endDate} </p>
                        <p>{info[0]?.price}$</p>
                        {info[0]?.car ? <p style={{ fontWeight: "bold" }}>Car included!</p> : <p></p>}
                        <p>Enjoy the beautiful {info[0]?.hotelName} hotel</p>
                        <p>{info[0]?.description}</p>
                    </div>
                    <div className="imageDealInfo">
                        <img className="imageByLocationDeal" src={`http://localhost:8080/users/data/image/?location=${info[0]?.location}`} alt={`${info[0]?.location}`} />
                    </div>
                    <div className="flightTickets">
                        {info[1]?.map((info, index) => {
                            return <div className="flightTicket" key={Math.random()}>
                                {index === 1 ? <p>Inbound flight &#9992;&#65039;</p> : <p>Outbound flight &#9992;&#65039;</p>}
                                <p>Airline: {info.airline}</p>
                                <p>Origin: {info.startLocation}</p>
                                <p>Destination: {info.destination}</p>
                                <p>Date: {info.date}</p>
                                <p>Departure: {info.departure}</p>
                                <p>Arriving-Time: {info.arriving}</p>
                            </div>;

                        })}
                    </div>
                    <p className="goToPayment" onClick={goToPayment}>payment</p>
                </div>
            </div>
        </div>
    );
}

export default DealInfo;