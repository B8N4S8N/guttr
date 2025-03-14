/**
 * Utility for safely working with clipboard
 */

/**
 * Safely copy text to clipboard with fallback
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export async function copyToClipboard(text) {
  try {
    // Check if the Clipboard API is available
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return success;
  } catch (error) {
    console.warn('Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * Check if clipboard API is supported
 * @returns {boolean} - Whether clipboard API is supported
 */
export function isClipboardSupported() {
  return !!(
    typeof navigator !== 'undefined' && 
    navigator.clipboard && 
    navigator.clipboard.writeText
  );
} 