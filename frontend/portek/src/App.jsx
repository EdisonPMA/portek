import { Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Exprience from "./pages/Experience";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardHome from "./dashboard/pages/DashboardHome";
import MessagesPage from "./dashboard/pages/MessagesPage";
import {
  AdminProfile,
  AdminSkills,
  AdminProjects,
  AdminProjectImages,
  AdminExperience,
  AdminEducation,
  AdminCertifications,
  AdminBlogCategories,
  AdminBlogs,
  AdminTestimonials,
  AdminSocialLinks,
  AdminResume,
  AdminSettings,
} from "./dashboard/pages/AdminPages";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/experience" element={<Exprience />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="project-images" element={<AdminProjectImages />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="blog-categories" element={<AdminBlogCategories />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="social-links" element={<AdminSocialLinks />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
