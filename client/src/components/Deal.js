
import { useNavigate } from "react-router-dom";
function Deal(props) {
   const navigate = useNavigate();
   const moveToDealInfo = () => {
      navigate(`/deals/info/${props.id}`);
   };
   return (
      <div className="deal" onClick={moveToDealInfo}>
         <div className="imageDiv">
            <img className="imageByLocation" src={`http://localhost:8080/users/data/image/?location=${props.location}`} alt={`${props.location}`} />
         </div>
         <div className='contentDiv'>
            <div className="datesConetent">
               <h3>dates:</h3>
               <p>{props.startDate}</p>
               <p>{props.endDate}</p>
            </div>
            <div className="mainContentDiv">
               <h2>{props.location}</h2>
               {props.car ? <p>Car Included</p> : <span></span>}
               <p>{props.description}</p>
               <p>{props.hotelName}</p>
               <p>Just for {props.price}$</p>
            </div>
         </div>
      </div>
   );
}

export default Deal;