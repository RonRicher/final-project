import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Admin() {
    const [requests, setRequests] = useState([]);
    const [flag, setFlag] = useState('');
    const [parText, setParText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getRequest();
    }, [flag]);


    async function getRequest() {
        const response = await fetch(`http://localhost:8080/companies/data/requests`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (data) {
            setRequests(data);
        } else {
            setParText('you are not an admin');
            setTimeout(() => navigate('/home'), 2000);
        }
    }

    const acceptRequest = async (companyName) => {
        const response = await fetch(`http://localhost:8080/companies/data/requests/accept`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: companyName
                })

            });
        setFlag(Math.random());

    };

    const declineRequest = async (companyName) => {
        const response = await fetch(`http://localhost:8080/companies/data/requests/decline`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: companyName
                })

            });
        setFlag(Math.random());
    };
    return (
        <>
            <h1>{parText}</h1>
            {requests?.map(request => {

                return <div key={Math.random()}>
                    <p>  companyName:{request.companyName}
                        companyEmail:{request.companyEmail}
                        companyPhone:{request.companyPhone} </p>
                    <button onClick={() => acceptRequest(request.companyName)}>accept request</button>
                    <button onClick={() => declineRequest(request.companyName)}>decline request</button>
                </div>;
            })}
        </>
    );
}

export default Admin;