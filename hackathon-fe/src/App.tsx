import { Route, Routes } from "react-router-dom";

import CreateProjectPage from "./pages/create-project";
import ProjectListPage from "./pages/project-list";
import CreateTaskPage from "./pages/create-task";
import ProjectDetailPage from "./pages/project-detail";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<CreateProjectPage />} path="/projects/create" />
      <Route element={<ProjectListPage />} path="/projects" />
      <Route element={<CreateTaskPage />} path="projects/:id/task" />
      <Route element={<ProjectDetailPage />} path="projects/:id" />
    </Routes>
  );
}

export default App;
