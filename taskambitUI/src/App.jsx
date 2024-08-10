import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home/Home'
import SignUp from './components/home/SignUp';
import SignIn from './components/home/SignIn'
function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
  )
}
export default App
