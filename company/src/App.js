
import './App.css';
import LogIn from './components/LogIn';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import Hotels from './components/Hotels';
import Flights from './components/Flights';
import CreateDeal from './components/createDeal';
import Admin from './components/Admin';
import PermissionProvider from './context/permissionContext';


function App() {
  return (
<PermissionProvider>
    <Routes>
      <Route path="/" element={<LogIn />}></Route>
      <Route path="/Home" element={<Home />}></Route>
      <Route path="/password" element={<ResetPassword />}></Route>
      <Route path="/changePassword" element={<ChangePassword />}></Route>
      <Route path="/api/hotels" element={<Hotels />}></Route>
      <Route path="/api/flights" element={<Flights />}></Route>
      <Route path="/deal" element={<CreateDeal />}></Route>
      <Route path="/admin" element={<Admin />}></Route>
    </Routes>
    </PermissionProvider>
  );
}

export default App;
