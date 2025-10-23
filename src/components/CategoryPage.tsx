import React, { useState, useEffect } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { categoryService, type SubCategory } from "@/services/api";
import type { AdvancedSearchResult } from "@/services/api";
import heroBg from "@/assets/hero_bg.png";

interface CategoryPageProps {
  category: AdvancedSearchResult;
  onBack: () => void;
  onWordClick: (word: AdvancedSearchResult) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onBack,
  onWordClick,
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "video";
    url: string;
    filename: string;
  } | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getSubCategories(category._id);
        if (response.success) {
          setSubCategories(response.data);
        } else {
          setError("Failed to load category items");
        }
      } catch (err) {
        console.error("Error fetching sub-categories:", err);
        setError("Failed to load category items");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [category._id]);

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
    setAudioError(null);
  };

  const handleWordClick = (subCategory: SubCategory) => {
    // Convert SubCategory to AdvancedSearchResult format
    const searchResult: AdvancedSearchResult = {
      _id: subCategory._id,
      name: subCategory.name,
      chickasawAnalytical: subCategory.chickasawAnalytical,
      language: subCategory.language,
      mediaUrl: subCategory.audioUrl,
      category: subCategory.category,
      mediaType: subCategory.mediaType,
      type: "word",
      createdAt: subCategory.createdAt,
      updatedAt: subCategory.updatedAt,
      __v: subCategory.__v,
      audio: {
        id: subCategory._id,
        filename: subCategory.name,
        contentType: "audio/mpeg",
        url: subCategory.audioUrl,
      },
      video: subCategory.videoUrl
        ? {
            id: subCategory._id,
            filename: subCategory.name,
            contentType: "video/mp4",
            url: subCategory.videoUrl,
          }
        : null,
    };

    onWordClick(searchResult);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative h-[300px] overflow-hidden">
        {/* Background Image with Red Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(296.02deg, rgba(211, 25, 28, 0.7) 0%, rgba(191, 17, 20, 0.8) 100%)",
          }}
        />

        {/* Category Title */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {category.name}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-sm font-medium mb-8 transition-colors duration-200 hover:underline"
          style={{ color: "#D3191C" }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </button>

        {/* Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Analytical
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Humes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {subCategories.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleWordClick(item)}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.chickasawAnalytical}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                    <span className="mr-2">{item.language}</span>
                    {item.audioUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAudioPlay(item.audioUrl, item.name);
                        }}
                        className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 shadow-sm"
                        style={{ backgroundColor: "#D3191C" }}
                      >
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No items found in this category.
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

export default CategoryPage;
