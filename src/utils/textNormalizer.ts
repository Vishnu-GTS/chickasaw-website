/**
 * Normalize Chickasaw text to ensure proper diacritical mark rendering
 * across different browsers and platforms
 */

/**
 * Normalizes Unicode text to NFC (Canonical Composition) form
 * This ensures combining diacritical marks are properly positioned
 * 
 * @param text - The text to normalize
 * @returns Normalized text with proper Unicode composition
 */
export function normalizeChickasawText(text: string): string {
    if (!text) return text;

    // Normalize to NFC (Canonical Composition)
    // This combines base characters with combining marks into precomposed characters when possible
    return text.normalize('NFC');
}

/**
 * Normalizes HTML content containing Chickasaw text
 * 
 * @param html - HTML string containing Chickasaw text
 * @returns Normalized HTML string
 */
export function normalizeChickasawHTML(html: string): string {
    if (!html) return html;

    // Normalize the entire HTML string
    return html.normalize('NFC');
}

