import { useState } from "react";
import { useEffect } from "react";


function Admin() {


    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getRequest();
    }, []);


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
    };
    return (
        <>
            {requests?.map(request => {

                return <div>
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