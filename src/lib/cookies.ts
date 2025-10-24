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

        // If no cookie exists, set default history
        if (!cookieValue) {
            const defaultHistory: SearchHistoryItem[] = [
                {
                    "id": "68f9e0f758872957ec816f5a",
                    "name": "wolf",
                    "chickasawAnalytical": "nashoba",
                    "language": "nashoba",
                    "mediaUrl": "/api/gridfs/68f9d87458872957ec816e10",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307582152
                },
                {
                    "id": "68f9e0f558872957ec816f1c",
                    "name": "bird",
                    "chickasawAnalytical": "foshi?",
                    "language": "foshi",
                    "mediaUrl": "/api/gridfs/68f9d85d58872957ec816dcc",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307565184
                },
                {
                    "id": "68f9e0f658872957ec816f32",
                    "name": "fish",
                    "chickasawAnalytical": "nani?",
                    "language": "nunni",
                    "mediaUrl": "/api/gridfs/68f9d86658872957ec816de4",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307543233
                },
                {
                    "id": "68f9cafd58872957ec816c51",
                    "name": "Animals",
                    "chickasawAnalytical": '',
                    "language": '',
                    "mediaUrl": "",
                    "category": {
                        "_id": "",
                        "name": ""
                    },
                    "timestamp": 1761307531657
                },
                {
                    "id": "68f9e0f558872957ec816f26",
                    "name": "chicken",
                    "chickasawAnalytical": "akanka?",
                    "language": "akaka",
                    "mediaUrl": "/api/gridfs/68f9d86058872957ec816dd6",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307518898
                }
            ];

            // Save the default history to cookies
            saveSearchHistory(defaultHistory);
            return defaultHistory;
        }

        const decoded = decodeURIComponent(cookieValue);
        const parsedHistory = JSON.parse(decoded);

        // Check if the parsed history is empty array
        if (Array.isArray(parsedHistory) && parsedHistory.length === 0) {
            // Set default search history if cookie exists but is empty
            const defaultHistory: SearchHistoryItem[] = [
                {
                    "id": "68f9e0f758872957ec816f5a",
                    "name": "wolf",
                    "chickasawAnalytical": "nashoba",
                    "language": "nashoba",
                    "mediaUrl": "/api/gridfs/68f9d87458872957ec816e10",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307582152
                },
                {
                    "id": "68f9e0f558872957ec816f1c",
                    "name": "bird",
                    "chickasawAnalytical": "foshi?",
                    "language": "foshi",
                    "mediaUrl": "/api/gridfs/68f9d85d58872957ec816dcc",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307565184
                },
                {
                    "id": "68f9e0f658872957ec816f32",
                    "name": "fish",
                    "chickasawAnalytical": "nani?",
                    "language": "nunni",
                    "mediaUrl": "/api/gridfs/68f9d86658872957ec816de4",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307543233
                },
                {
                    "id": "68f9cafd58872957ec816c51",
                    "name": "Animals",
                    "chickasawAnalytical": '',
                    "language": '',
                    "mediaUrl": "",
                    "category": {
                        "_id": "",
                        "name": ""
                    },
                    "timestamp": 1761307531657
                },
                {
                    "id": "68f9e0f558872957ec816f26",
                    "name": "chicken",
                    "chickasawAnalytical": "akanka?",
                    "language": "akaka",
                    "mediaUrl": "/api/gridfs/68f9d86058872957ec816dd6",
                    "category": {
                        "_id": "68f9cafd58872957ec816c51",
                        "name": "Animals"
                    },
                    "timestamp": 1761307518898
                }
            ];

            // Save the default history to cookies
            saveSearchHistory(defaultHistory);
            return defaultHistory;
        }

        return parsedHistory;
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

// Initialize search history on site load
export const initializeSearchHistory = (): void => {
    if (typeof window === 'undefined') return;

    try {
        // This will automatically check and set default data if no cookie exists or if cookie is empty
        const history = getSearchHistory();
        console.log('Search history initialized with', history.length, 'items');
    } catch (error) {
        console.error('Error initializing search history:', error);
    }
};
