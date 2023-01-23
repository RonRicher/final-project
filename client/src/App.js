import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Register from './components/Register';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
  <Route path="/" element={<LogIn />}></Route>
    </Routes>
  );
}

export default App;
