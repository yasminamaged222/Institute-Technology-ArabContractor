import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Courses from "../pages/Courses";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<PublicLayout />}> */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
      {/* </Route> */}
    </Routes>
  );
};

export default AppRoutes;