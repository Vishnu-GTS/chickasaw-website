import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AdvancedSearchResult } from "@/services/api";

interface SearchResultsProps {
  results: AdvancedSearchResult[];
  isVisible: boolean;
  onResultClick: (word: AdvancedSearchResult) => void;
  onAudioPlay?: (audioUrl: string, filename: string) => void;
  children: React.ReactNode;
  searchQuery: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isVisible,
  onResultClick,
  onAudioPlay,
  children,
  searchQuery,
  searchInputRef,
}) => {
  const [open, setOpen] = React.useState(false);
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(
    undefined
  );

  // Open popover when we have results and should be visible
  React.useEffect(() => {
    if (isVisible && results.length > 0) {
      setOpen(true);
      // Get the width of the search input
      if (searchInputRef?.current) {
        const width = searchInputRef.current.offsetWidth;
        setPopoverWidth(width);
      }
    } else if (!isVisible && searchQuery.trim() === "") {
      setOpen(false);
    }
  }, [isVisible, results.length, searchQuery, searchInputRef]);

  const handleOpenChange = (newOpen: boolean) => {
    // Don't close if there's text in the search bar
    if (!newOpen && searchQuery.trim() !== "") {
      return; // Prevent closing
    }
    setOpen(newOpen);
  };

  // Don't render the popover if we don't have results or shouldn't be visible
  if (!isVisible || results.length === 0) {
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
          // Prevent closing when clicking on the search input
          const target = e.target as HTMLElement;
          if (target.closest('input[type="text"]')) {
            e.preventDefault();
          }
        }}
      >
        <div>
          {results.slice(0, 10).map((word) => {
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
                        onAudioPlay(audioUrl, filename);
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
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchResults;
