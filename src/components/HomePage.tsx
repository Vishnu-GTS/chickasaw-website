import HeroSection from "./HeroSection";
import MainContent from "./MainContent";
import { CategoriesProvider } from "@/contexts/CategoriesContext";

const HomePage = () => {
  return (
    <CategoriesProvider limit={15}>
      <HeroSection onSearchResultClick={() => {}} onCategoryClick={() => {}} />
      <MainContent />
    </CategoriesProvider>
  );
};

export default HomePage;
