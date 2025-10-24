import HeroSection from "../components/features/HeroSection";
import MainContent from "../components/features/MainContent";
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
