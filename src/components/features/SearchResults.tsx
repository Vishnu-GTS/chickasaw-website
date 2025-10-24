import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AdvancedSearchResult } from "@/types";

interface SearchResultsProps {
  results: AdvancedSearchResult[];
  isVisible: boolean;
  onResultClick: (word: AdvancedSearchResult) => void;
  onAudioPlay?: (audioUrl: string, filename: string, analytical?: string, humes?: string) => void;
  children: React.ReactNode;
  searchQuery: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isVisible,
  onResultClick,
  onAudioPlay,
  children,
  searchQuery,
  searchInputRef,
  isLoading = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(
    undefined
  );

  // Open popover when we have results, are loading, or when we should show no results message
  React.useEffect(() => {
    if (
      isVisible &&
      (results.length > 0 || isLoading || searchQuery.trim() !== "")
    ) {
      setOpen(true);
      // Get the width of the search input
      if (searchInputRef?.current) {
        const width = searchInputRef.current.offsetWidth;
        setPopoverWidth(width);

        // Ensure the input stays focused when popover opens
        setTimeout(() => {
          if (searchInputRef?.current) {
            searchInputRef.current.focus();
          }
        }, 0);
      }
    } else if (!isVisible && searchQuery.trim() === "") {
      setOpen(false);
    }
  }, [isVisible, results.length, isLoading, searchQuery, searchInputRef]);

  const handleOpenChange = (newOpen: boolean) => {
    // Don't close if there's text in the search bar
    if (!newOpen && searchQuery.trim() !== "") {
      return; // Prevent closing
    }
    setOpen(newOpen);

    // If opening the popover, ensure the input stays focused
    if (newOpen && searchInputRef?.current) {
      // Use setTimeout to ensure the focus happens after the popover opens
      setTimeout(() => {
        if (searchInputRef?.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Don't render the popover if we shouldn't be visible
  if (!isVisible) {
    return <>{children}</>;
  }

  // Show popover even with no results if there's a search query
  if (results.length === 0 && searchQuery.trim() === "") {
    return <>{children}</>;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="p-0 max-h-96 overflow-y-auto"
        align="start"
        side="bottom"
        sideOffset={8}
        style={{ width: popoverWidth ? `${popoverWidth}px` : "auto" }}
        onInteractOutside={(e) => {
          // Prevent closing when clicking on the search input or its container
          const target = e.target as HTMLElement;
          if (
            target.closest('input[type="text"]') ||
            target.closest(".search-container")
          ) {
            e.preventDefault();
            // Ensure the input stays focused
            if (searchInputRef?.current) {
              searchInputRef.current.focus();
            }
          }
        }}
        onMouseDown={(e) => {
          // Prevent the popover from stealing focus from the input
          e.preventDefault();
        }}
      >
        <div>
          {isLoading ? (
            <div className="p-4">
              <LoadingSpinner size="sm" text="Searching..." />
            </div>
          ) : results.length > 0 ? (
            results.slice(0, 10).map((word) => {
              const audioUrl = word.mediaUrl;
              const filename = word.audio?.filename || word.name;

              return (
                <div
                  key={word._id}
                  className="flex text-justify justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => onResultClick(word)}
                >
                  <div className="flex flex-col">
                    <div className="font-medium text-base text-black mb-1">
                      {word.name}
                    </div>
                    {word.category?.name && (
                      <div className="text-sm text-black font-medium mb-1">
                        Category: {word.category?.name}
                      </div>
                    )}
                    <div className="text-[#666666]">
                      {word.chickasawAnalytical}
                    </div>
                  </div>
                  {audioUrl && (
                    <Button
                      size="icon"
                      className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: "#CC0000" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          "#B30000")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          "#CC0000")
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAudioPlay && audioUrl) {
                          onAudioPlay(audioUrl, filename, word.chickasawAnalytical, word.language );
                        } else {
                          console.log(`Playing audio for: ${word.name}`);
                        }
                      }}
                    >
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-500 text-sm">
                No results found for "{searchQuery}"
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Try different keywords or check spelling
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchResults;
