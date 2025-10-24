import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { categoryService, type Category } from "@/services/api";

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

interface CategoriesProviderProps {
  children: ReactNode;
  limit?: number;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
  limit,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const isInitialized = useRef(false);

  const fetchCategories = async () => {
    if (hasFetched.current) {
      return; // Prevent duplicate calls
    }

    try {
      hasFetched.current = true;
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategories(limit);
      if (response.success) {
        setCategories(response.data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Error loading categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch on initial load if we haven't fetched yet
    if (!isInitialized.current && !hasFetched.current) {
      isInitialized.current = true;
      fetchCategories();
    }
  }, []);

  const refetch = async () => {
    hasFetched.current = false; // Reset the flag to allow refetch
    await fetchCategories();
  };

  const value: CategoriesContextType = {
    categories,
    loading,
    error,
    refetch,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
