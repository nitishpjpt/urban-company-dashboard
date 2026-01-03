import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Hero from "../Components/Hero/Hero"
import Services from "../Components/Services/Services"
import HowItWorks from "../Components/HowItWorks/HowItWorks"
import WhyChooseUs from "../Components/WhyChooseUs/WhyChooseUs"
import Testimonials from "../Components/Testimonials/Testimonials"
import BecomePro from '../Components/BecomePro/BecomePro'
import Footer from '../Components/Footer/Footer'


const Main = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Services/>
    <HowItWorks/>
    <WhyChooseUs/>
    <Testimonials/>
    <BecomePro/>
    <Footer/>
    </>

  )
}

export default Main