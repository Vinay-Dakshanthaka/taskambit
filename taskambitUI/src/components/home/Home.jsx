import React from 'react'
import HeroSection from './HeroSection'
import WorkWithUs from './WorkWithUs'
import Header from './Navbar'
import Introduction from './Introduction'
import Information from './Information'
import Signin from './SignIn'
import SignUp from './SignUp'

const Home = () => {
  return (
    <>
        {/* <Header /> */}
        {/* <HeroSection /> */}
        <h1 className="text-9xl text-center">Home</h1>
        <WorkWithUs />
        {/* <Introduction/> */}
        {/* <Information/> */}

    </>
  )
}

export default Home