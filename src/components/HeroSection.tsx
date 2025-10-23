import React, { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SearchResults from "./SearchResults";
import { searchService, type AdvancedSearchResult } from "@/services/api";
import {
  getSearchHistory,
  addToSearchHistory,
  type SearchHistoryItem,
} from "@/lib/cookies";
import heroBg from "@/assets/hero_bg.png";

interface HeroSectionProps {
  onSearchResultClick: (word: AdvancedSearchResult) => void;
  onCategoryClick: (category: AdvancedSearchResult) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchResultClick,
  onCategoryClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState<AdvancedSearchResult[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
  } | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Perform API search
  const performApiSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setApiResults([]);
      return;
    }

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

  // Load recent searches on component mount
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length > 0);
  };

  const handleResultClick = (word: AdvancedSearchResult) => {
    setSearchQuery(word.name);
    setShowResults(false);

    // Save to search history
    addToSearchHistory({
      id: word._id,
      name: word.name,
      chickasawAnalytical: word.chickasawAnalytical,
      language: word.language,
      mediaUrl: word.mediaUrl,
      category: word.category,
    });

    // Update recent searches state
    setRecentSearches(getSearchHistory());

    // Check result type and navigate accordingly
    if (word.type === "category") {
      onCategoryClick(word);
    } else {
      onSearchResultClick(word);
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
    setAudioError(null); // Clear any previous errors
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setApiResults([]);
    // Focus back to the search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <section className="relative h-[500px] overflow-visible">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Red Gradient Overlay - More transparent to show background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(296.02deg, rgba(211, 25, 28, 0.7) 0%, rgba(191, 17, 20, 0.8) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 max-w-4xl leading-tight">
          Listen and Learn to Chickasaw words
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white mb-6 max-w-2xl opacity-95">
          Learn Chickasaw words and phrases with clear audio.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mb-6 z-50">
          <SearchResults
            results={searchResults}
            isVisible={showResults}
            onResultClick={handleResultClick}
            onAudioPlay={handleAudioPlay}
            searchQuery={searchQuery}
            searchInputRef={searchInputRef}
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
                className="pl-14 pr-12 py-4 h-14 text-gray-700 placeholder-gray-400 bg-white border-0 rounded-full shadow-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-base"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-30  rounded-full transition-colors duration-200"
                  type="button"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </SearchResults>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
          {recentSearches.slice(0, 5).map((item, index) => (
            <Button
              key={index}
              className="px-4 py-2 text-gray-700 text-sm font-medium rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Media Preview Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMedia(null);
            setAudioError(null);
          }
        }}
      >
        <DialogContent className="max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Preview: {selectedMedia?.filename}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="mt-4">
              {selectedMedia.type === "audio" ? (
                audioError ? (
                  <div className="text-red-600 text-center p-4">
                    <p>Unable to load audio file</p>
                    <p className="text-sm text-gray-500 mt-2">
                      URL: {selectedMedia.url}
                    </p>
                    <p className="text-sm text-gray-500">
                      This might be due to CORS restrictions or the file not
                      being accessible.
                    </p>
                  </div>
                ) : (
                  <audio
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full"
                    onError={(e) => {
                      console.error("Audio load error:", e);
                      setAudioError("Failed to load audio file");
                    }}
                    onLoadStart={() => {
                      console.log("Audio loading started:", selectedMedia.url);
                    }}
                    onCanPlay={() => {
                      console.log("Audio can play:", selectedMedia.url);
                    }}
                  />
                )
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full"
                  onError={(e) => {
                    console.error("Video load error:", e);
                  }}
                />
              )}
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
                setAudioError(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
