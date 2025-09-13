import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomersList from './pages/Customers/CustomersList';
import CustomerDetail from './pages/Customers/CustomerDetail';
import Reports from './pages/Reports/Reports';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<Layout><Dashboard /></Layout>}
        />
        <Route
          path="/customers"
          element={<Layout><CustomersList /></Layout>}
        />
        <Route
          path="/customers/:id"
          element={<Layout><CustomerDetail /></Layout>}
        />
        <Route
          path="/reports"
          element={<Layout><Reports /></Layout>}
        />
      </Routes>
    </Router>
  );
}

export default App;
