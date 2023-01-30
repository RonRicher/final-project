function Deal(props) {
    return ( 
     <div>
        <p>{props.location}</p>
        <p>{props.car}</p>
        <p>{props.description}</p>
        <p>{props.hotelName}</p>
        <p>{props.startDate}</p>
        <p>{props.endDate}</p>
        <p>{props.price}</p>
     </div>
     );
}

export default Deal;