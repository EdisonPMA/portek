import CrudManager from "../components/CrudManager";
import { entities } from "../config/entities";

export function AdminProfile() {
  return <CrudManager config={entities.profile} />;
}

export function AdminSkills() {
  return <CrudManager config={entities.skills} />;
}

export function AdminProjects() {
  return <CrudManager config={entities.projects} />;
}

export function AdminProjectImages() {
  return <CrudManager config={entities.projectImages} />;
}

export function AdminExperience() {
  return <CrudManager config={entities.experience} />;
}

export function AdminEducation() {
  return <CrudManager config={entities.education} />;
}

export function AdminCertifications() {
  return <CrudManager config={entities.certifications} />;
}

export function AdminBlogCategories() {
  return <CrudManager config={entities.blogCategories} />;
}

export function AdminBlogs() {
  return <CrudManager config={entities.blogs} />;
}

export function AdminTestimonials() {
  return <CrudManager config={entities.testimonials} />;
}

export function AdminSocialLinks() {
  return <CrudManager config={entities.socialLinks} />;
}

export function AdminResume() {
  return <CrudManager config={entities.resume} />;
}

export function AdminSettings() {
  return <CrudManager config={entities.settings} />;
}
