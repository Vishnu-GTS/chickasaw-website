import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
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
import type { SubCategory } from "@/services/api";
import { searchService, type AdvancedSearchResult } from "@/services/api";
import {
  getSearchHistory,
  addToSearchHistory,
  type SearchHistoryItem,
} from "@/lib/cookies";
import heroBg from "@/assets/hero_bg.png";

interface WordDetailsProps {
  word: SubCategory;
  onBack: () => void;
  onSearchResultClick?: (word: AdvancedSearchResult) => void;
  onCategoryClick?: (category: AdvancedSearchResult) => void;
}

const WordDetails: React.FC<WordDetailsProps> = ({
  word,
  onBack,
  onSearchResultClick,
  onCategoryClick,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
  } | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState<AdvancedSearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

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
    if (word.type === "category" && onCategoryClick) {
      onCategoryClick(word);
    } else if (onSearchResultClick) {
      onSearchResultClick(word);
    }
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
    <div className="bg-white min-h-screen">
      {/* Hero Section with Search */}
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
      </section>

      {/* Current Word Section */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium mb-8 transition-colors duration-200 hover:underline"
            style={{ color: "#D3191C" }}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </button>

          {/* Current Word Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {word.name}
            </h2>
          </div>

          {/* Word Details */}
          <div className="bg-white">
            <div className="flex flex-col space-y-6 mb-8">
              <div className="flex items-baseline">
                <span className="text-lg text-black font-semibold mr-3">
                  Analytical:
                </span>
                <span className="text-lg text-black font-medium">
                  {word.chickasawAnalytical}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="text-lg text-black font-semibold mr-3">
                  Humes:
                </span>
                <span className="text-lg text-black font-medium">
                  {word.language}
                </span>
              </div>
            </div>

            {/* Audio Play Button */}
            {word.audioUrl && (
              <div className="mb-8">
                <Button
                  onClick={() => handleAudioPlay(word.audioUrl, word.name)}
                  className="text-white px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: "#CC0000",
                    borderColor: "#CC0000",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#B30000";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#CC0000";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play
                </Button>
              </div>
            )}

            {/* Note */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <p className="text-base text-gray-700 font-normal">
                <strong className="text-gray-900">Note:</strong> Please click
                the play button to play the audio.
              </p>
            </div>
          </div>
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
    </div>
  );
};

export default WordDetails;
