import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import WordDetails from "./components/WordDetails";
import AllCategories from "./components/AllCategories";
import CreditsPage from "./components/CreditsPage";
import AboutPage from "./components/AboutPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
