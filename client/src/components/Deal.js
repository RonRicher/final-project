
import {useNavigate} from "react-router-dom";
function Deal(props) {
    const navigate = useNavigate();
   const moveToDealInfo = () => {
    navigate(`/deals/info/${props.id}`);
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
        <a onClick={moveToDealInfo}>read more...</a>
     </div>
     );
}

export default Deal;