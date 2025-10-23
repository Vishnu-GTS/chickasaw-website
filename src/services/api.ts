import axios from 'axios';

const API_BASE_URL = 'https://chickasaw-admin-one.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API response types
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

// Advanced Search API types
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

// API service functions
export const categoryService = {
    // Get all categories
    getCategories: async (): Promise<CategoryListResponse> => {
        try {
            const response = await api.get<CategoryListResponse>('/category/list');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get sub-categories by category ID
    getSubCategories: async (categoryId: string): Promise<SubCategoryListResponse> => {
        try {
            const response = await api.get<SubCategoryListResponse>(`/sub-category/single/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sub-categories:', error);
            throw error;
        }
    },
};

// Advanced search service
export const searchService = {
    // Advanced search with query and type parameters
    advancedSearch: async (query: string, type: string = 'all'): Promise<AdvancedSearchResponse> => {
        try {
            const response = await api.get<AdvancedSearchResponse>(`/search/advanced?q=${encodeURIComponent(query)}&type=${type}`);
            return response.data;
        } catch (error) {
            console.error('Error performing advanced search:', error);
            throw error;
        }
    },
};

export default api;
