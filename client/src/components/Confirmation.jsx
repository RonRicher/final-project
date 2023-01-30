import { useLocation } from 'react-router-dom';

function Confirmation() {
    const location = useLocation();
    console.log(location.state);
    const { mathRandom, quantity, price, firstName, lastName, email, phone } = location.state;
    return (
        <>
            <p>Dear {firstName} {lastName}, <br /> Your reservation number
                {mathRandom} is been confirmed. an email with details about your trip sent to your
                email address: {email}.
                price: {price}<br />quantity: {quantity}  </p>
        </>
    );
}

export default Confirmation;