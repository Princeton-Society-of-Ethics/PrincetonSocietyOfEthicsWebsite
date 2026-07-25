import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLayout from "@/components/layout/PageLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import AboutPage from "@/pages/AboutPage";
import HomePage from "@/pages/HomePage";
import InitiativesPage from "@/pages/InitiativesPage";
import InterviewSeriesPage from "@/pages/InterviewSeriesPage";
import JoinPage from "@/pages/JoinPage";
import MagazinePage from "@/pages/MagazinePage";
import MomentsPage from "@/pages/MomentsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TeamPage from "@/pages/TeamPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/initiatives" element={<InitiativesPage />} />
            <Route path="/initiatives/moments" element={<MomentsPage />} />
            <Route path="/initiatives/interview-series" element={<InterviewSeriesPage />} />
            <Route path="/journal" element={<MagazinePage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
