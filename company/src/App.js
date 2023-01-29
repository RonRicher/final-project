
import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Register from './components/Register';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import Hotels from './components/Hotels';
import Flights from './components/Flights';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />}></Route>
      <Route path="/Home" element={<Home />}></Route>
      <Route path="/password" element={<ResetPassword />}></Route>
      <Route path="/changePassword" element={<ChangePassword />}></Route>
      <Route path="/hotels" element={<Hotels />}></Route>
      <Route path="/flights" element={<Flights />}></Route>
    </Routes>
  );
}

export default App;
