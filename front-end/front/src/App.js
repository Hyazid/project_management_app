import 'bootstrap/dist/css/bootstrap.min.css';

import ProjectsList from "./components/ProjectsList";
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import TeamList from './components/TeamList';
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/dashboard' element={<PrivateRoute><ProjectsList /></PrivateRoute>}/>
      <Route path='/TeamList' element={<PrivateRoute><TeamList /></PrivateRoute>}/>
    </Routes>
  );
}

export default App;
