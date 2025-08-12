import React, { useContext, useEffect } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../Context/ThemeContext';
import Features from '../components/Features';
import ScrollStack, { ScrollStackItem } from '../components/ui/ScrollStack';
import LightRays from '../components/ui/LightRays';
import Hero2 from '../components/Hero2';
import { TextParallaxContentExample } from '../components/ParallexExample';
import SwappingFeatures from '../components/Features';
import PreLoader from '../components/ui/PreLoader';
import Hero3 from '../components/Hero3';
import Hero4 from '../components/Hero4';
import Features4 from '../components/Features4';
import FeaturedVenues from '../components/FeaturedVenues';
import TrendingSports from '../components/TrendingSports';
import { TestimonialsSection } from '../components/ui/ScrollingTestimonials';
import CommunityCTA from '../components/CTAsection';
import CommunityCTAWhite from '../components/CTAsection';


// Your other components like Ribbons, BlobCursor, etc. can be imported as needed.

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  const { dark, changeTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // }, [dispatch, navigate, user]);

  return (
    // Main page container with a background color
    <div className='bg-[#F9F9F9]'>
      {/* <NavbarDemo/> */}

      {/* <Hero /> */}
      {/* <Hero2/> */}
      <Hero3/>
      <FeaturedVenues/>
      <TrendingSports/>
      <TestimonialsSection/>
      <CommunityCTAWhite/>
      
      {/* <Hero4/> */}
      
      {/* <StickySwappingFeature /> */}
      {/* <Features/> */}
      {/* <Features4/> */}
      {/* <TextParallaxContentExample/> */}
      
      {/* ▼▼▼ SCROLL STACK SECTION ▼▼▼ */}
      {/* This container defines the viewport area for the scroll stack animation. */}
      {/* It's important to give it a specific height. */}
    
      {/* ▲▲▲ END SCROLL STACK SECTION ▲▲▲ */}
      
      {/* You can place more components like <About/> here */}
      
      <Footer />
    </div>
  );
}

export default HomePage;