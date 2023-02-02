import Cookies from "js-cookie";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import '../css/Admin.css';


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
            if (document.cookie) {
                setParText('you are not an admin');
                setTimeout(() => navigate('/home'), 2000);
            }
            else {
                setParText('you are not an admin');
                setTimeout(() => navigate('/'), 2000);
            }
        }
    }


    const acceptRequest = async (companyName, companyEmail) => {
        const response = await fetch(`http://localhost:8080/companies/data/requests/accept`,
            {
                method: "PUT",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: companyName,
                    companyEmail: companyEmail
                })

            });
        setFlag(Math.random());

    };

    const declineRequest = async (companyName) => {
        const response = await fetch(`http://localhost:8080/companies/data/requests/decline`,
            {
                method: "DELETE",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: companyName
                })

            });
        setFlag(Math.random());
    };
    return (
        <>
            <NavBar />
            {requests.length === 0 ?

                <><h1 className='not-found'>No requests founds.</h1></> : <><h1 className='not-found'>Requests:</h1></>

            }
            {requests?.map(request => {
                return <div className="admin-div" key={request.companyName}>
                    <p><strong>companyName:</strong> {request.companyName},&nbsp;
                        <strong>companyEmail:</strong> {request.companyEmail},&nbsp;
                        <strong>companyPhone:</strong> {request.companyPhone}</p>
                    <button className="admin-btn" id="accept" onClick={() => acceptRequest(request.companyName, request.companyEmail)}> &#10004;</button>
                    <button className="admin-btn" id="decline" onClick={() => declineRequest(request.companyName)}>&#10060;</button>
                </div>;
            })}
        </>
    );
}

export default Admin;