import 'bootstrap/dist/css/bootstrap.min.css';

import ProjectsList from "./components/ProjectsList";
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import TeamList from './components/TeamList';
import Stats from './components/Stats';
import ProjectsPage from './components/ProjectsPage';
import TaskAssign from './components/TaskAssign';
import Profile from './components/Profile';
import Mail from './components/Mail';
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/dashboard' element={<PrivateRoute><ProjectsPage /></PrivateRoute>}/>
      <Route path='/Profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
      <Route path='/TeamList' element={<PrivateRoute><TeamList /></PrivateRoute>}/>
      <Route path='/Stats' element={<PrivateRoute><Stats /></PrivateRoute>}/>
      <Route path='/Mail' element={<PrivateRoute><Mail /></PrivateRoute>}/>
      <Route path='/MyTasks' element={<PrivateRoute><TaskAssign /></PrivateRoute>}/>
    </Routes>
  );
}

export default App;
