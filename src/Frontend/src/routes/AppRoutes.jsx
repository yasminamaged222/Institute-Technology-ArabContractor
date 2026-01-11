import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Courses from "../pages/Courses";
import Overview from "../pages/overview";
import Vision_goals from "../pages/vision_and_goals/vision_goals";
import News from '../pages/News';

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<PublicLayout />}> */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/mission" element={<Vision_goals />} />
        <Route path="/news" element={<News />} />
      {/* </Route> */}
    </Routes>
  );
};

export default AppRoutes;