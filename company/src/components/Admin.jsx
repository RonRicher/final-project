import { useState } from "react";
import { useEffect } from "react";


function Admin() {
    const [requests, setRequests] = useState([]);
    const [flag, setFlag] = useState('');

    useEffect(() => {
        getRequest();
    }, [flag]);


    async function getRequest() {
        const response = await fetch(`http://localhost:8080/companies/data/requests`);
        const data = await response.json();
        setRequests(data);
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
            setFlag(Math.random())
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
            setFlag(Math.random())
    };
    return (
        <>
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