import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Register from './components/Register';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import DealInfo from './components/DealInfo';

function App() {
  return (
    <Routes>
  <Route path="/" element={<LogIn />}></Route>
  <Route path="/Home" element={<Home />}></Route>
  <Route path="/password" element={<ResetPassword />}></Route>
  <Route path="/changePassword" element={<ChangePassword />}></Route>
  <Route path="/deals/info/:id" element={<DealInfo />}></Route>
    </Routes>
  );
}

export default App;
