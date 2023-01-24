import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Register from './components/Register';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Routes>
  <Route path="/" element={<LogIn />}></Route>
  <Route path="/Home" element={<Home />}></Route>
  <Route path="/ResetPassword" element={<ResetPassword />}></Route>
    </Routes>
  );
}

export default App;
