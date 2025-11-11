import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import MediaLoader from "@/components/ui/media-loader";
import SearchResults from "../components/features/SearchResults";

import { searchService } from "@/services/api";
import {
  getSearchHistory,
  addToSearchHistory,
  type SearchHistoryItem,
} from "@/lib/cookies";
import heroBg from "@/assets/hero_bg.png";
import type { AdvancedSearchResult, SubCategory } from "@/types";

const WordDetails: React.FC = () => {
  const { wordName } = useParams<{
    wordName: string;
  }>();
  const navigate = useNavigate();

  // State management
  const [word, setWord] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState<AdvancedSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);

  // Refs for optimization
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isFetchingWordDetails = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchAbortControllerRef = useRef<AbortController | null>(null);
  const isInitialLoad = useRef(true);

  // Fetch word details
  useEffect(() => {
    const fetchWordDetails = async () => {
      if (!wordName || isFetchingWordDetails.current) return;

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        isFetchingWordDetails.current = true;
        setLoading(true);
        setError(null);

        // Use word name from URL
        const displayWordName = wordName
          ? decodeURIComponent(wordName)
          : "Word";

        // Try to get word details from API
        try {
          console.log("Fetching word details for:", wordName);
          const response = await searchService.advancedSearch(
            wordName,
            "all",
            abortController.signal
          );
          console.log("API response:", response);

          if (response.success && response.data.results.length > 0) {
            const wordResult = response.data.results[0];
            // Use API data but keep the name from URL
            const wordFromApi: SubCategory = {
              _id: wordResult._id,
              name: displayWordName, // Keep name from URL
              chickasawAnalytical: wordResult.chickasawAnalytical || "",
              language: wordResult.language || "",
              audioUrl: wordResult.mediaUrl || "",
              videoUrl: wordResult.video?.url || null,
              category: wordResult.category,
              mediaType: wordResult.mediaType || "",
              createdAt: wordResult.createdAt || "",
              updatedAt: wordResult.updatedAt || "",
              __v: wordResult.__v || 0,
            };
            setWord(wordFromApi);
          } else {
            // No API results found, create word with name from URL only
            const wordFromUrl: SubCategory = {
              _id: "",
              name: displayWordName,
              chickasawAnalytical: "",
              language: "",
              audioUrl: "",
              videoUrl: "",
              category: {
                _id: "",
                name: "",
                createdAt: "",
                updatedAt: "",
                __v: 0,
              },
              mediaType: "",
              createdAt: "",
              updatedAt: "",
              __v: 0,
            };
            setWord(wordFromUrl);
          }
        } catch (apiError) {
          console.error("API call failed, showing word from URL:", apiError);
          // API failed, but we still show the word name from URL
          const wordFromUrl: SubCategory = {
            _id: "",
            name: displayWordName,
            chickasawAnalytical: "",
            language: "",
            audioUrl: "",
            videoUrl: "",
            category: {
              _id: "",
              name: "",
              createdAt: "",
              updatedAt: "",
              __v: 0,
            },
            mediaType: "",
            createdAt: "",
            updatedAt: "",
            __v: 0,
          };
          setWord(wordFromUrl);
          // Don't set error state for API failures - just show the word name
          console.log("Showing word from URL without API data");
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error fetching word details:", err);

          // Even if there's an error, try to show the word name from URL
          const wordFromUrl: SubCategory = {
            _id: "",
            name: wordName ? decodeURIComponent(wordName) : "Word",
            chickasawAnalytical: "",
            language: "",
            audioUrl: "",
            videoUrl: "",
            category: {
              _id: "",
              name: "",
              createdAt: "",
              updatedAt: "",
              __v: 0,
            },
            mediaType: "",
            createdAt: "",
            updatedAt: "",
            __v: 0,
          };
          setWord(wordFromUrl);

          // Only set error for critical failures
          if (
            err.message.includes("Network Error") ||
            err.message.includes("timeout")
          ) {
            setError(
              "Network error. Please check your connection and try again."
            );
          } else if (err.message.includes("404")) {
            setError("Word not found. Please try a different word.");
          } else if (err.message.includes("500")) {
            setError("Server error. Please try again later.");
          } else {
            // For other errors, just log them but don't show error to user
            console.warn(
              "Non-critical error, showing word without full details:",
              err.message
            );
          }
        }
      } finally {
        setLoading(false);
        isFetchingWordDetails.current = false;
        isInitialLoad.current = false;
      }
    };

    fetchWordDetails();

    // Cleanup function
    return () => {
      isFetchingWordDetails.current = false;
      isInitialLoad.current = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [wordName]);

  const handleAudioPlay = () => {
    setShowMediaPlayer(!showMediaPlayer);
  };

  // Perform API search
  const performApiSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setApiResults([]);
      setIsSearchLoading(false);
      return;
    }

    // Cancel any ongoing search request
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    // Create new AbortController for this search request
    const searchAbortController = new AbortController();
    searchAbortControllerRef.current = searchAbortController;

    setIsSearchLoading(true);
    try {
      const response = await searchService.advancedSearch(
        query,
        "all",
        searchAbortController.signal
      );
      if (response.success) {
        setApiResults(response.data.results);
      } else {
        setApiResults([]);
      }
    } catch (error) {
      // Don't log error if it's an abort error
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error performing API search:", error);
        setApiResults([]);
      }
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Use only API results
  const searchResults = apiResults;

  // Debounced API search effect
  useEffect(() => {
    // Don't perform search if we're still loading word details, if there's no search query, or if this is the initial load
    if (loading || !searchQuery.trim() || isInitialLoad.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      performApiSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      // Cancel any ongoing search request when effect cleans up
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
        searchAbortControllerRef.current = null;
      }
    };
  }, [searchQuery, performApiSearch, loading]);

  // Load recent searches on component mount
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  // Event handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setShowResults(value.length > 0);
    },
    []
  );

  const handleResultClick = useCallback(
    (word: AdvancedSearchResult) => {
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
        const encodedCategoryName = encodeURIComponent(word.name);
        navigate(`/category/${word._id}/${encodedCategoryName}`);
      } else {
        const encodedWordName = encodeURIComponent(word.name);
        navigate(`/word/${encodedWordName}`);
      }
    },
    [navigate]
  );

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  }, [searchQuery]);

  const handleSearchBlur = useCallback(() => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      if (!showResults || searchQuery.trim() === "") {
        setShowResults(false);
      }
    }, 200);
  }, [showResults, searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setShowResults(false);
    setApiResults([]);
    setIsSearchLoading(false);
    // Focus back to the search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Remove the early return for loading state - we'll show loader inline

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-lg text-red-600 text-center">{error}</div>
            <Button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Trigger a re-fetch by updating the wordName dependency
                window.location.reload();
              }}
              className="text-white px-6 py-2 rounded-lg"
              style={{
                backgroundColor: "#CC0000",
                borderColor: "#CC0000",
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Add handler for recent search clicks
  const handleRecentSearchClick = (item: SearchHistoryItem) => {
    // Check if it's a category or a word
    // Categories have empty chickasawAnalytical and language
    const isCategory =
      !item.chickasawAnalytical && !item.language && !item.category?._id;

    if (isCategory) {
      // Navigate to category page
      const encodedCategoryName = encodeURIComponent(item.name);
      navigate(`/category/${item.id}/${encodedCategoryName}`);
    } else {
      // Navigate to word details page
      const encodedWordName = encodeURIComponent(item.name);
      navigate(`/word/${encodedWordName}`);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative  py-9.5 overflow-visible">
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
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 max-w-4xl leading-tight">
            Listen and Learn to Chickasaw words
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white mb-6  opacity-95">
            Learn Chickasaw words and phrases with clear audio.
          </p>
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mb-6 z-50 search-container">
            <SearchResults
              results={searchResults}
              isVisible={showResults}
              onResultClick={handleResultClick}
              onAudioPlay={() => {}}
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
            {recentSearches.slice(0, 6).map((item, index) => (
              <Button
                key={index}
                onClick={() => handleRecentSearchClick(item)}
                className="px-4 py-2 text-gray-700 text-sm font-medium rounded-full bg-[#FFFFFFCC]  hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Current Word Section */}
      <div className="bg-white py-8">
        <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="flex items-center text-sm font-medium mb-8 transition-colors duration-200 hover:underline"
            style={{ color: "#D3191C" }}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Button>

          {/* Loading State for Word Details */}
          {loading ? (
            <div className="space-y-6">
              {/* Word Title Skeleton */}
              <div className="mb-4">
                <Skeleton height="h-10" width="w-64" />
              </div>

              {/* Word Details Skeleton */}
              <div className="bg-white">
                <div className="flex flex-wrap lg:gap-8 mb-8">
                  <div className="flex items-baseline">
                    <Skeleton height="h-6" width="w-24" />
                    <Skeleton height="h-6" width="w-32" className="ml-2" />
                  </div>
                  <div className="flex items-baseline">
                    <Skeleton height="h-6" width="w-20" />
                    <Skeleton height="h-6" width="w-28" className="ml-2" />
                  </div>
                </div>

                {/* Play Button Skeleton */}
                <div className="mb-8"> 
                  <Skeleton height="h-12" width="w-32" />
                </div>

                {/* Note Skeleton */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                  <Skeleton height="h-4" width="w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Current Word Title */}
              <div className=" mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {word?.name || "Word"}
                </h2>
              </div>

              {/* Word Details */}
              <div className="bg-white">
                <div className="flex flex-col lg:flex-row lg:gap-8 mb-8">
                  <div className="flex items-baseline">
                    <span className="text-lg text-black font-semibold mr-1.5">
                      Analytical:
                    </span>
                    {word?.chickasawAnalytical ? (
                      <span className="text-lg text-black font-medium">
                        {word.chickasawAnalytical}
                      </span>
                    ) : (
                      <Skeleton height="h-6" width="w-32" />
                    )}
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-lg text-black font-semibold mr-1.5">
                      Humes:
                    </span>
                    {word?.language ? (
                      <span className="text-lg text-black font-medium">
                        {word.language}
                      </span>
                    ) : (
                      <Skeleton height="h-6" width="w-28" />
                    )}
                  </div>
                </div>

                {/* Audio Play Button */}
                {word?.audioUrl ? (
                  <>
                    <div className="mb-8">
                      <Button
                        onClick={handleAudioPlay}
                        className="text-white px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center gap-3 hover:shadow-xl"
                        style={{
                          backgroundColor: "#CC0000",
                          borderColor: "#CC0000",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = "#B30000";
                          (e.target as HTMLButtonElement).style.transform =
                            "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = "#CC0000";
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
                        {showMediaPlayer ? "Hide" : "Play"}
                      </Button>
                    </div>

                    {/* Inline Media Player */}
                    {showMediaPlayer && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                        <MediaLoader
                          src={
                            word.audioUrl.startsWith("http")
                              ? word.audioUrl
                              : `https://admin.anompa.com${word.audioUrl}`
                          }
                          type="audio"
                          autoPlay
                          onError={(error) => {
                            console.error("Media load error:", error);
                          }}
                          onLoadStart={() => {
                            console.log(
                              "Media loading started:",
                              word.audioUrl
                            );
                          }}
                          onCanPlay={() => {
                            console.log("Media can play:", word.audioUrl);
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-8">
                    <Skeleton height="h-12" width="w-32" />
                  </div>
                )}

                {/* Note */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                  <p className="text-base text-gray-700 font-normal">
                    <strong className="text-gray-900">Note:</strong> Please
                    click the play button to play the audio.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
