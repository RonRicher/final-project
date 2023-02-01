import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';

function Confirmation() {
    const location = useLocation();
    console.log(location.state);
    const { mathRandom, quantity, price, firstName, lastName, email, phone, resLocation } = location.state;
    return (
        <>
            <NavBar />
            <div className='confirmationDiv'>
                <p className='confirmationMessage'>
                    <h3>Dear {firstName.charAt(0).toUpperCase() + firstName.slice(1)} {lastName.charAt(0).toUpperCase() + lastName.slice(1)},</h3>
                    <p className='confirmationMessageBody'>
                        Your reservation for {resLocation} with reservation number {mathRandom} has been confirmed.
                        An email containing the details of your trip has been sent to {email}.
                        <br />The total cost of the reservation is {price}$ and it is for {quantity} {quantity > 1 ? 'people' : 'person'}.</p></p>

            </div>

        </>
    );
}

export default Confirmation;