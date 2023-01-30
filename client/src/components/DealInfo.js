import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
                description: info[0]?.description
            }
        });
    };
    return (
        <div>
            <p>{info[0]?.location}</p>
            <p>{info[0]?.startDate}</p>
            <p>{info[0]?.endDate}</p>
            <p>{info[0]?.price}</p>
            <p>{info[0]?.car ? 'true' : 'false'}</p>
            <p>{info[0]?.description}</p>
            <p>{info[0]?.hotelName}</p>
            {info[1]?.map((info, index) => {
                return <div>
                    {index === 1 ? <p>inbound flight</p> : <p>outbound flight</p>}
                    <p>Airline:{info.airline}</p>
                    <p>Origin:{info.startLocation}</p>
                    <p>Destination:{info.destination}</p>
                    <p>Date:{info.date}</p>
                    <p>Departure:{info.departure}</p>
                    <p>Arriving-Time{info.arriving}</p>
                </div>;

            })}
            <p onClick={goToPayment}>payment</p>
        </div>
    );
}

export default DealInfo;