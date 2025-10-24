import axios from 'axios';
import { API_CONFIG } from '@/constants';
import type {
    CategoryListResponse,
    SubCategoryListResponse,
    AdvancedSearchResponse,
} from '@/types';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service functions
export const categoryService = {
    // Get all categories
    getCategories: async (limit?: number): Promise<CategoryListResponse> => {
        try {
            const params = limit ? `?limit=${limit}` : '';
            const response = await api.get<CategoryListResponse>(`/category/list${params}`);
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
    advancedSearch: async (query: string, type: string = 'all', signal?: AbortSignal): Promise<AdvancedSearchResponse> => {
        try {
            const response = await api.get<AdvancedSearchResponse>(`/search/advanced?q=${encodeURIComponent(query)}&type=${type}`, {
                signal
            });
            return response.data;
        } catch (error) {
            console.error('Error performing advanced search:', error);
            throw error;
        }
    },
};

export default api;
