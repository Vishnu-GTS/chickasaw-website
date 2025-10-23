// Cookie utility functions for managing search history

export interface SearchHistoryItem {
    id: string;
    name: string;
    chickasawAnalytical: string;
    language: string;
    mediaUrl: string;
    category?: {
        _id: string;
        name: string;
    };
    timestamp: number;
}

const SEARCH_HISTORY_KEY = 'chickasaw_search_history';
const MAX_HISTORY_ITEMS = 10;

// Get search history from cookies
export const getSearchHistory = (): SearchHistoryItem[] => {
    if (typeof window === 'undefined') return [];

    try {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${SEARCH_HISTORY_KEY}=`))
            ?.split('=')[1];

        if (!cookieValue) return [];

        const decoded = decodeURIComponent(cookieValue);
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Error parsing search history from cookies:', error);
        return [];
    }
};

// Save search history to cookies
export const saveSearchHistory = (history: SearchHistoryItem[]): void => {
    if (typeof window === 'undefined') return;

    try {
        const encoded = encodeURIComponent(JSON.stringify(history));
        const expires = new Date();
        expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year

        document.cookie = `${SEARCH_HISTORY_KEY}=${encoded}; expires=${expires.toUTCString()}; path=/`;
    } catch (error) {
        console.error('Error saving search history to cookies:', error);
    }
};

// Add a new search item to history
export const addToSearchHistory = (item: Omit<SearchHistoryItem, 'timestamp'>): void => {
    const history = getSearchHistory();

    // Remove existing item with same ID if it exists
    const filteredHistory = history.filter(h => h.id !== item.id);

    // Add new item at the beginning
    const newItem: SearchHistoryItem = {
        ...item,
        timestamp: Date.now()
    };

    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    saveSearchHistory(updatedHistory);
};

// Clear search history
export const clearSearchHistory = (): void => {
    if (typeof window === 'undefined') return;

    document.cookie = `${SEARCH_HISTORY_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
