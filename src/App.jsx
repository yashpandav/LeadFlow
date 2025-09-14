import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApiProvider } from './contexts/ApiContext';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomersList from './pages/Customers/CustomersList';
import CustomerDetail from './pages/Customers/CustomerDetail';
import LeadsList from './pages/Leads/LeadsList';
import LeadDetail from './pages/Leads/LeadDetail';
import Reports from './pages/Reports/Reports';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <ApiProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}
          />
          <Route
            path="/customers"
            element={<PrivateRoute><Layout><CustomersList /></Layout></PrivateRoute>}
          />
          <Route
            path="/customers/:id"
            element={<PrivateRoute><Layout><CustomerDetail /></Layout></PrivateRoute>}
          />
          <Route
            path="/leads"
            element={<PrivateRoute><Layout><LeadsList /></Layout></PrivateRoute>}
          />
          <Route
            path="/leads/:id"
            element={<PrivateRoute><Layout><LeadDetail /></Layout></PrivateRoute>}
          />
          <Route
            path="/reports"
            element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>}
          />
        </Routes>
      </Router>
    </ApiProvider>
  );
}

export default App;
