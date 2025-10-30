import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import WordDetails from "./pages/WordDetails";
import AllCategories from "./pages/AllCategories";
import CreditsPage from "./pages/CreditsPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import { initializeSearchHistory } from "./lib/cookies";

function App() {
  // Initialize search history when the app loads
  useEffect(() => {
    initializeSearchHistory();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route
            path="/category/:categoryId/:categoryName"
            element={<CategoryPage />}
          />
          <Route path="/word/:wordName" element={<WordDetails />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
