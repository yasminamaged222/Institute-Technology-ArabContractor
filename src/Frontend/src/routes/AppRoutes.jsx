import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Overview from "../pages/overview";
import Vision_goals from "../pages/vision_and_goals/vision_goals";
import News from '../pages/News';
import CoursesPage from "../pages/CoursesPage";
import Library from "../pages/Library";
import CustomersPage from '../pages/CustomersPage'; // Adjust path accordingly
import VocationalTraining from '../pages/VocationalTraining';
import GesrElSuezPage from '../pages/GesrElSuezPage';
import ShobraTrainingPage from '../pages/ShobraTrainingPage';
import Certifications from '../pages/Certifications'; 
import Team from '../pages/Team'; 
import OnlineTrainingPage from "../pages/OnlineTrainingPage";
import TechnicalSchoolPage from "../pages/TechnicalSchoolPage";
import Protocols from '../pages/Protocols';
import TechnicalEducation from '../pages/TechnicalEducation';
import TestsSection from '../pages/TestsSection';
import ContactPage from '../pages/ContactPage'; // Path where you saved the contact code
import ShoppingCartPage from '../pages/ShoppingCartPage';
import Galery from '../pages/Galary';
import FutureLeadersCouncil from '../pages/Leaders';
import Instructors from '../pages/Instructors';
import CheckoutPage from "../pages/CheckoutPage";
import NewsDetails from '../pages/newsDetails.jsx';
import CourseDetails from '../pages/CourseDetails';
import TrainingMethods from '../pages/TrainingMethods';
import OnsiteTraining from '../pages/OnsiteTraining_fixed';
import CEAProgram from '../pages/CEAProgram';
import ScrollToTop from '../components/ScrollToTop'
import SearchPage from '../pages/Searchpage';
import Mycourses from '../pages/Mycourses';
import AdminDashboard from '../pages/AdminDashboard';   // أو المسار الصحيح
import PaymentResultPage from '../pages/Paymentresultpage.jsx';



   
const AppRoutes = () => {
    return (
    <>
   
    <ScrollToTop />
    <Routes>

      {/* <Route element={<PublicLayout />}> */}
            <Route index element={<Home />} />
            <Route path="/vocational-training" element={<VocationalTraining />} />
                <Route path="gesr-el-suez" element={<GesrElSuezPage />} />
                <Route path="shobra" element={<ShobraTrainingPage />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/mission" element={<Vision_goals />} />
        <Route path="/news" element={<News />} />
            <Route path="/courses/:slug" element={<CoursesPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/team" element={<Team />} />
            <Route path="/online-training" element={<OnlineTrainingPage />} /> 
            <Route path="/Technical_Schools" element={<TechnicalSchoolPage />} />
            <Route path="/protocols" element={<Protocols />} />
            <Route path="/technical-education" element={<TechnicalEducation />} />
            <Route path="/tests" element={<TestsSection />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/gallery" element={<Galery />} />
            <Route path="/future-leaders" element={<FutureLeadersCouncil />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/course/:slug" element={<CourseDetails />} />
            <Route path="/training-methods" element={<TrainingMethods />} />
            <Route path="/cea-program" element={<CEAProgram />} />
            <Route path="/onsite-training" element={<OnsiteTraining />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/my-courses" element={<Mycourses />} />    
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/payment/result" element={<PaymentResultPage />} />

            





            
    </Routes>
    </>
  );
};

export default AppRoutes;