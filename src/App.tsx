import { useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MainContent from "./components/MainContent";
import CategoryPage from "./components/CategoryPage";
import WordDetails from "./components/WordDetails";
import type { AdvancedSearchResult } from "./services/api";

type AppPage = "home" | "category" | "word";

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [selectedWordFromSearch, setSelectedWordFromSearch] =
    useState<AdvancedSearchResult | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<AdvancedSearchResult | null>(null);

  const handleSearchResultClick = (word: AdvancedSearchResult) => {
    setSelectedWordFromSearch(word);
    setCurrentPage("word");
  };

  const handleCategoryClick = (category: AdvancedSearchResult) => {
    setSelectedCategory(category);
    setCurrentPage("category");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedWordFromSearch(null);
    setSelectedCategory(null);
  };

  const handleWordClickFromCategory = (word: AdvancedSearchResult) => {
    setSelectedWordFromSearch(word);
    setCurrentPage("word");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "category":
        return selectedCategory ? (
          <CategoryPage
            category={selectedCategory}
            onBack={handleBackToHome}
            onWordClick={handleWordClickFromCategory}
          />
        ) : null;
      case "word":
        return selectedWordFromSearch ? (
          <WordDetails
            word={{
              _id: selectedWordFromSearch._id,
              name: selectedWordFromSearch.name,
              language: selectedWordFromSearch.language,
              category: selectedWordFromSearch.category,
              mediaType: selectedWordFromSearch.mediaType,
              createdAt: selectedWordFromSearch.createdAt,
              updatedAt: selectedWordFromSearch.updatedAt,
              __v: selectedWordFromSearch.__v,
              chickasawAnalytical: selectedWordFromSearch.chickasawAnalytical,
              audioUrl: selectedWordFromSearch.mediaUrl,
              videoUrl: selectedWordFromSearch.video?.url || null,
            }}
            onBack={handleBackToHome}
            onSearchResultClick={handleSearchResultClick}
            onCategoryClick={handleCategoryClick}
          />
        ) : null;
      default:
        return (
          <>
            <HeroSection
              onSearchResultClick={handleSearchResultClick}
              onCategoryClick={handleCategoryClick}
            />
            <MainContent selectedWordFromSearch={selectedWordFromSearch} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {renderCurrentPage()}
    </div>
  );
}

export default App;
