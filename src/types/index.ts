// Centralized type definitions for the Chickasaw website

// Chickasaw Word types
export interface ChickasawWord {
    id: string;
    english: string;
    chickasaw: string;
    category: string;
    audioUrl?: string;
}

// API Response types
export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    wordCount: number;
}

export interface CategoryListResponse {
    success: boolean;
    message: string;
    data: Category[];
}

export interface SubCategory {
    _id: string;
    name: string;
    language: string;
    category: {
        _id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    mediaType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    chickasawAnalytical: string;
    audioUrl: string;
    videoUrl: string | null;
}

export interface SubCategoryListResponse {
    success: boolean;
    message: string;
    data: SubCategory[];
}

export interface Word {
    _id: string;
    english: string;
    chickasaw: string;
    categoryId: string;
    subCategoryId?: string;
    audioUrl?: string;
    imageUrl?: string;
    videoUrl?: string;
    pronunciation?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface WordListResponse {
    success: boolean;
    data: Word[];
}

export interface WordResponse {
    success: boolean;
    data: Word;
}

// Search types
export interface SearchResult {
    _id: string;
    english: string;
    chickasaw: string;
    categoryId: string;
    subCategoryId?: string;
    audioUrl?: string;
    imageUrl?: string;
    videoUrl?: string;
    pronunciation?: string;
    description?: string;
}

export interface AdvancedSearchResult {
    _id: string;
    name: string;
    language: string;
    chickasawAnalytical: string;
    category: {
        _id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    mediaType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    audio?: {
        id: string;
        filename: string;
        contentType: string;
        url: string;
    };
    video?: {
        id: string;
        filename: string;
        contentType: string;
        url: string;
    } | null;
    mediaUrl: string;
    type: string;
}

export interface AdvancedSearchResponse {
    success: boolean;
    message: string;
    data: {
        results: AdvancedSearchResult[];
        total: number;
        hasMore: boolean;
    };
}

export interface SearchResponse {
    success: boolean;
    data: SearchResult[];
}

// Media types
export interface MediaItem {
    type: "audio" | "video" | "image";
    url: string;
    filename: string;
}

// Component prop types
export interface HeroSectionProps {
    onSearch: (query: string) => void;
    onCategoryClick: (category: AdvancedSearchResult) => void;
}

export interface CategoryCardProps {
    category: Category;
    onClick: (category: Category) => void;
}

export interface WordCardProps {
    word: Word;
    onClick: (word: Word) => void;
}

// Context types
export interface CategoriesContextType {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refreshCategories: () => Promise<void>;
}

// Navigation types
export interface NavigationItem {
    label: string;
    path: string;
    icon?: React.ComponentType;
}

// Error types
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Loading states
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}
