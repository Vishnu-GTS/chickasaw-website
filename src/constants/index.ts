// Application constants

// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://admin.anompa.com/api/',
    TIMEOUT: 10000,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
    DEBOUNCE_DELAY: 300,
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS: 50,
} as const;

// Media Configuration
export const MEDIA_CONFIG = {
    SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'ogg'],
    SUPPORTED_VIDEO_FORMATS: ['mp4', 'webm', 'ogg'],
    SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
} as const;

// UI Configuration
export const UI_CONFIG = {
    ANIMATION_DURATION: 300,
    LOADING_TIMEOUT: 10000,
    SPLASH_SCREEN_DURATION: 2000,
} as const;

// Route paths
export const ROUTES = {
    HOME: '/',
    ALL_CATEGORIES: '/all-categories',
    CATEGORY: '/category/:categoryId/:categoryName',
    WORD: '/word/:wordName',
    CREDITS: '/credits',
    ABOUT: '/about',
    PRIVACY_POLICY: '/privacy-policy',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    CATEGORIES: 'chickasaw_categories',
    SEARCH_HISTORY: 'chickasaw_search_history',
    USER_PREFERENCES: 'chickasaw_user_preferences',
} as const;

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    DATA_LOADED: 'Data loaded successfully',
    SEARCH_COMPLETED: 'Search completed',
    CATEGORY_SELECTED: 'Category selected',
} as const;
