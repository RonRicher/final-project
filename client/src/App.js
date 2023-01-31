import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Register from './components/Register';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import DealInfo from './components/DealInfo';
import Payment from './components/Payment';
import UserProvider from './context/userContext';
import Confirmation from './components/Confirmation';
import SearchedDeals from './components/SearchedDeals';
import PersonalTrip from './components/PersonalTrip';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LogIn />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/password" element={<ResetPassword />}></Route>
        <Route path="/changePassword" element={<ChangePassword />}></Route>
        <Route path="/deals/info/:id" element={<DealInfo />}></Route>
        <Route path="/deals/:id/payment" element={<Payment />}></Route>
        <Route path="/search/deals" element={<SearchedDeals />}></Route>
        <Route path="/personal/trip" element={< PersonalTrip/>}></Route>
        <Route path="/deals/:id/payment/confirmation" element={<Confirmation />}></Route>
        <Route path="/*" element={<Home />}></Route>

      </Routes>
    </UserProvider>
  );
}

export default App;
