import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Overview from "../pages/overview";
import Vision_goals from "../pages/vision_and_goals/vision_goals";
import News from '../pages/News';
import CoursesPage from "../pages/CoursesPage";
import CourseCategory from '../pages/CourseCategory';
import Library from "../pages/Library";
import CustomersPage from '../pages/CustomersPage'; // Adjust path accordingly
import VocationalTraining from '../pages/VocationalTraining';
import GesrElSuezPage from '../pages/GesrElSuezPage';
import ShobraTrainingPage from '../pages/ShobraTrainingPage';
import Certifications from '../pages/Certifications'; // ÊÃßÏ ãä ÇáãÓÇÑ ÇáÕÍíÍ ááãáÝ
import Team from '../pages/Team'; // ÊÃßÏ ãä ÇáãÓÇÑ
import OnlineTrainingPage from "../pages/OnlineTrainingPage";
import TechnicalSchoolPage from "../pages/TechnicalSchoolPage";
import Protocols from '../pages/Protocols';
import TechnicalEducation from '../pages/TechnicalEducation';
import TestsSection from '../pages/TestsSection';


const AppRoutes = () => {
    return (

    <Routes>
      {/* <Route element={<PublicLayout />}> */}
            <Route index element={<Home />} />
            <Route path="/vocational-training" element={<VocationalTraining />} />

                <Route path="gesr-el-suez" element={<GesrElSuezPage />} />
                <Route path="shobra" element={<ShobraTrainingPage />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/mission" element={<Vision_goals />} />
        <Route path="/news" element={<News />} />
        <Route path="/courses/civil-engineer-training" element={<CoursesPage />} />
        <Route path="/courses/:category" element={<CourseCategory />} />
            <Route path="/library" element={<Library />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/team" element={<Team />} />
            <Route path="/online-training" element={<OnlineTrainingPage />} /> 
            <Route path="/Technical_Schools" element={<TechnicalSchoolPage />} />
            <Route path="/protocols" element={<Protocols />} />
            <Route path="/technical-education" element={<TechnicalEducation />} />
            <Route path="/tests" element={<TestsSection />} />



            
    </Routes>
  );
};

export default AppRoutes;