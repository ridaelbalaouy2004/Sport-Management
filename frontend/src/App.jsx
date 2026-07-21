import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ROUTES } from './utils/constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sports from './pages/Sports';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import Results from './pages/Results';
import Rankings from './pages/Rankings';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

const App = () => (
  <Routes>
    {/* Public */}
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />

    {/* Protected — all use MainLayout which handles auth redirect */}
    <Route element={<MainLayout />}>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.SPORTS} element={<Sports />} />
      <Route path={ROUTES.PLAYERS} element={<Players />} />
      <Route path={ROUTES.TEAMS} element={<Teams />} />
      <Route path={ROUTES.MATCHES} element={<Matches />} />
      <Route path={ROUTES.RESULTS} element={<Results />} />
      <Route path={ROUTES.RANKINGS} element={<Rankings />} />
      <Route path={ROUTES.ADMIN} element={<Admin />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
  </Routes>
);

export default App;
