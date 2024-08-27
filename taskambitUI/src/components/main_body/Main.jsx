import React from 'react'
import DynamicBreadcrumb from './breadcrumb/DynamicBreadCrumb'
import { Route, Routes } from 'react-router-dom'
import Home from './home/Home'
import UserDashboard from '../user/UserDashboard'

const Main = () => {
  return (
    <div className="main">
            <DynamicBreadcrumb />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
            </Routes>
            </div>
  )
}

export default Main