import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SkeletonCard } from "@/components/ui/skeleton";
import MediaLoader from "@/components/ui/media-loader";
import SearchResults from "./SearchResults";
import SplashScreen from "./SplashScreen";
import {
  searchService,
  type AdvancedSearchResult,
  type Category,
} from "@/services/api";
import {
  useCategories,
  CategoriesProvider,
} from "@/contexts/CategoriesContext";

const AllCategoriesContent: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState<AdvancedSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
  } | null>(null);
  const navigate = useNavigate();
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Perform API search
  const performApiSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setApiResults([]);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    try {
      const response = await searchService.advancedSearch(query, "all");
      if (response.success) {
        setApiResults(response.data.results);
      } else {
        setApiResults([]);
      }
    } catch (error) {
      console.error("Error performing API search:", error);
      setApiResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Use only API results
  const searchResults = apiResults;

  // Debounced API search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performApiSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performApiSearch]);

  // Set filtered categories when categories are loaded
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Show splash screen while loading categories
  if (loading) {
    return <SplashScreen />;
  }

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category._id}/${encodeURIComponent(category.name)}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length > 0);
  };

  const handleResultClick = (word: AdvancedSearchResult) => {
    setSearchQuery(word.name);
    setShowResults(false);

    // Check result type and navigate accordingly
    if (word.type === "category") {
      // Encode the category name for URL
      const encodedCategoryName = encodeURIComponent(word.name);
      navigate(`/category/${word._id}/${encodedCategoryName}`);
    } else {
      // Encode the word name for URL
      const encodedWordName = encodeURIComponent(word.name);
      navigate(`/word/${encodedWordName}`);
    }
  };

  const handleAudioPlay = (audioUrl: string, filename: string) => {
    // Construct full URL if it's a relative path
    const fullUrl = audioUrl.startsWith("http")
      ? audioUrl
      : `https://chickasaw-admin-one.vercel.app${audioUrl}`;

    setSelectedMedia({
      type: "audio",
      url: fullUrl,
      filename: filename,
    });
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      if (!showResults || searchQuery.trim() === "") {
        setShowResults(false);
      }
    }, 200);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setApiResults([]);
    setIsSearchLoading(false);
    // Focus back to the search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Background Image and Overlay */}
      <div
        className="relative h-75 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/hero_bg.png')`,
        }}
      >
        {/* Reddish-orange overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(211, 25, 28, 0.7)" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            All Category
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-4xl search-container">
            <SearchResults
              results={searchResults}
              isVisible={showResults}
              onResultClick={handleResultClick}
              onAudioPlay={handleAudioPlay}
              searchQuery={searchQuery}
              searchInputRef={searchInputRef}
              isLoading={isSearchLoading}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-30">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search word, category"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-14 pr-12 py-2 h-12 shadow-none outline-none focus:ring-0! text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg text-base"
                />
                {searchQuery && (
                  <Button
                    onClick={handleClearSearch}
                    variant="none"
                    className="absolute inset-y-0 right-2 top-1.5 pr-4 flex items-center z-30 rounded-full transition-colors duration-200"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </Button>
                )}
              </div>
            </SearchResults>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="space-y-6">
            {/* Show skeleton cards while loading */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="md" text="Loading categories..." />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className=" max-w-4xl mx-auto    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card
                key={category._id}
                className="cursor-pointer py-0 bg-white border shadow-none border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className="px-3 py-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-0">
                    {category.name}
                  </h3>
                  <p className="text-lg text-gray-500">
                    {category.wordCount} words
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading &&
          !error &&
          filteredCategories.length === 0 &&
          searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No categories found matching "{searchQuery}"
              </p>
            </div>
          )}
      </div>

      {/* Media Preview Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMedia(null);
          }
        }}
      >
        <DialogContent className="max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Preview: {selectedMedia?.filename}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="mt-4">
              <MediaLoader
                src={selectedMedia.url}
                type={selectedMedia.type}
                autoPlay
                onError={(error) => {
                  console.error("Media load error:", error);
                }}
                onLoadStart={() => {
                  console.log("Media loading started:", selectedMedia.url);
                }}
                onCanPlay={() => {
                  console.log("Media can play:", selectedMedia.url);
                }}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              className="text-white px-4 py-2 rounded"
              style={{
                backgroundColor: "rgb(211, 25, 28)",
                borderColor: "rgb(211, 25, 28)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "rgb(191, 17, 20)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "rgb(211, 25, 28)";
              }}
              onClick={() => {
                setSelectedMedia(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AllCategories: React.FC = () => {
  return (
    <CategoriesProvider>
      <AllCategoriesContent />
    </CategoriesProvider>
  );
};

export default AllCategories;
