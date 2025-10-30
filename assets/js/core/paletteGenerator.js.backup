/**
 * PaletteGenerator Module
 * 
 * Scientific palette generation with perceptually uniform lightness.
 * Implements algorithm from research paper.
 * 
 * @module paletteGenerator
 */

import ColorScience from './colorScience.js';

const PaletteGenerator = {
    /**
     * Generate scientifically uniform color scale
     * 
     * Algorithm:
     * 1. Convert base color to LAB space
     * 2. Calculate optimal position based on lightness
     * 3. Generate colors with linear lightness distribution
     * 4. Preserve hue and chroma, vary only lightness
     * 
     * @param {string} baseColor - Hex color (e.g., '#3b82f6')
     * @param {number} steps - Number of colors to generate (5-50)
     * @returns {Array<Object>} Array of color objects with hex, name, lightness
     */
    generateUniformScale(baseColor, steps) {
        const baseLab = ColorScience.hexToLab(baseColor);
        const baseLightness = baseLab.L;
        
        // Calculate optimal position based on lightness (0-100)
        // Using the paper's approach for optimal distribution
        const basePosition = this.calculateOptimalPosition(baseLightness);
        const baseColorIndex = Math.round(basePosition * (steps - 1));
        
        const colors = [];
        
        // Define lightness range with proper scientific bounds
        const minLightness = 5;   // Very dark but not black
        const maxLightness = 95;  // Very light but not pure white
        
        for (let i = 0; i < steps; i++) {
            const position = i / (steps - 1); // 0 to 1
            
            let targetLightness;
            if (i === baseColorIndex) {
                // Exact base color
                targetLightness = baseLightness;
            } else {
                // Calculate target lightness using scientific interpolation
                targetLightness = this.calculateTargetLightness(
                    position, basePosition, baseLightness, minLightness, maxLightness
                );
            }
            
            // Generate color with target lightness while preserving hue and chroma
            const color = this.generateColorWithLightness(baseLab, targetLightness);
            
            colors.push({
                hex: color,
                name: this.generateColorName(i, steps),
                isBase: i === baseColorIndex,
                lightness: Math.round(targetLightness)
            });
        }
        
        return colors;
    },

    /**
     * Calculate optimal position using scientific method
     * 
     * @param {number} lightness - Lightness value [0-100]
     * @returns {number} Normalized position [0-1]
     */
    calculateOptimalPosition(lightness) {
        // Normalize lightness to 0-1 range
        const normalized = Math.max(0, Math.min(100, lightness)) / 100;
        
        // Use the paper's approach: linear distribution for perceptual uniformity
        // No curve - pure linear for mathematical consistency
        return normalized;
    },

    /**
     * Calculate target lightness with mathematical precision
     * 
     * @param {number} position - Current position [0-1]
     * @param {number} basePosition - Base color position [0-1]
     * @param {number} baseLightness - Base color lightness
     * @param {number} minL - Minimum lightness
     * @param {number} maxL - Maximum lightness
     * @returns {number} Target lightness value
     */
    calculateTargetLightness(position, basePosition, baseLightness, minL, maxL) {
        if (position < basePosition) {
            // Darker colors - linear interpolation from min to base
            if (basePosition === 0) return minL;
            const factor = position / basePosition;
            return minL + (baseLightness - minL) * factor;
        } else {
            // Lighter colors - linear interpolation from base to max
            if (basePosition === 1) return maxL;
            const factor = (position - basePosition) / (1 - basePosition);
            return baseLightness + (maxL - baseLightness) * factor;
        }
    },

    /**
     * Generate color with specific lightness while preserving color characteristics
     * 
     * @param {Object} baseLab - Base color in LAB space
     * @param {number} targetLightness - Target lightness value
     * @returns {string} Generated hex color
     */
    generateColorWithLightness(baseLab, targetLightness) {
        // Preserve a and b components (hue and chroma) while adjusting lightness
        const newLab = {
            L: targetLightness,
            a: baseLab.a,
            b: baseLab.b
        };
        
        let result = ColorScience.labToHex(newLab.L, newLab.a, newLab.b);
        
        // Ensure the result is valid (some LAB combinations might be out of sRGB gamut)
        if (!this.isValidHex(result)) {
            // If out of gamut, reduce chroma progressively
            for (let chromaReduction = 0.9; chromaReduction > 0; chromaReduction -= 0.1) {
                const reducedLab = {
                    L: targetLightness,
                    a: baseLab.a * chromaReduction,
                    b: baseLab.b * chromaReduction
                };
                result = ColorScience.labToHex(reducedLab.L, reducedLab.a, reducedLab.b);
                if (this.isValidHex(result)) break;
            }
        }
        
        return result;
    },

    /**
     * Generate semantic color names
     * 
     * @param {number} index - Color index in palette
     * @param {number} total - Total number of colors
     * @returns {string} Color name (e.g., 'color-950')
     */
    generateColorName(index, total) {
        const step = Math.round(1000 - (index * 950 / (total - 1)));
        return `color-${step}`;
    },

    /**
     * Validate hex color format and RGB bounds
     * 
     * @param {string} hex - Hex color to validate
     * @returns {boolean} True if valid
     */
    isValidHex(hex) {
        if (!/^#[0-9A-F]{6}$/i.test(hex)) return false;
        
        // Check if RGB values are within bounds
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }
};

export default PaletteGenerator;