function Deal(props) {
    const [info,setInfo] = useState([]);

    async function getInfo() {
        const response = await fetch(`http://localhost:8080/users/data/dealInfo?dealId=${props.id}`);
        const data = await response.json();
        console.log(data);
        setInfo(data);
    }
    return ( 
     <div>
        <p>{props.location}</p>
        <p>{props.car}</p>
        <p>{props.description}</p>
        <p>{props.hotelName}</p>
        <p>{props.startDate}</p>
        <p>{props.endDate}</p>
        <p>{props.price}</p>
        <a onClick={getInfo}>read more...</a>
        {info.map(info => {
            return <div>
                <p>{info.airline}</p>
                <p>{info.startLocation}</p>
                <p>{info.destination}</p>
                <p>{info.date}</p>
                <p>{info.departure}</p>
                <p>{info.arriving}</p>
            </div>
        })}
     </div>
     );
}

export default Deal;