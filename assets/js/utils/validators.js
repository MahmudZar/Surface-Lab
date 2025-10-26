/**
 * Validators Module
 * 
 * Input validation and sanitization utilities
 * 
 * @module validators
 */

/**
 * Validate hex color format
 * Accepts 3 or 6 digit hex colors with # prefix
 * 
 * @param {string} hex - Color string to validate
 * @returns {boolean} True if valid hex color
 * 
 * @example
 * isValidHex('#3b82f6') // true
 * isValidHex('#fff')    // true
 * isValidHex('3b82f6')  // false (missing #)
 */
export function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normalize 3-digit hex to 6-digit hex
 * 
 * @param {string} hex - Hex color
 * @returns {string} 6-digit hex color
 * 
 * @example
 * normalizeHex('#fff') // '#ffffff'
 * normalizeHex('#3b82f6') // '#3b82f6'
 */
export function normalizeHex(hex) {
    if (!isValidHex(hex)) {
        throw new Error(`Invalid hex color: ${hex}`);
    }

    if (hex.length === 4) {
        return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    return hex;
}

/**
 * Validate steps input
 * Must be integer between 5 and 50
 * 
 * @param {number} steps - Number of steps
 * @returns {boolean} True if valid
 */
export function validateSteps(steps) {
    return Number.isInteger(steps) && steps >= 5 && steps <= 50;
}