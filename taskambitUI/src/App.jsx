import './App.css';
import Home from './components/main_body/home/Home';
import Signin from './components/main_body/auth/Signin';
import UserDashboard from './components/user/UserDashboard';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie for easier cookie handling
import Navbar from './components/main_body/home/Navbar';
import Signup from './components/main_body/auth/Signup';
import Footer from './components/footer/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Function to check if the user is logged in
    const checkAuthentication = () => {
      // Check if the token is present in cookies
      const token = Cookies.get('token');
      setIsAuthenticated(!!token);
    };

    checkAuthentication();
  }, []);

  // Determine if the current path requires Navbar
  const showNavbar = !['/signin'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar isAuthenticated={isAuthenticated} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/user-dashboard" /> : <Signin />}
        />
        <Route
          path="/user-dashboard"
          element={isAuthenticated ? <UserDashboard /> : <Navigate to="/signin" />}
        />
      </Routes>
      <Footer />
    </>
  );
}

// Wrap the App component with Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
