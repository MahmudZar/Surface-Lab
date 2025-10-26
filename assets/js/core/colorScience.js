/**
 * ColorScience Module
 * 
 * Pure functions for color space conversions.
 * Based on "Simplest Color Balance" research paper.
 * 
 * All functions are deterministic and side-effect free.
 * 
 * Color Spaces:
 * - sRGB: Standard RGB color space (web colors)
 * - Linear RGB: RGB with gamma removed
 * - XYZ: CIE 1931 color space (D65 illuminant)
 * - LAB: Perceptually uniform color space
 * 
 * @module colorScience
 */

const ColorScience = {
    /**
     * Convert sRGB component to linear RGB
     * Removes gamma correction (gamma = 2.4)
     * 
     * @param {number} c - sRGB component [0-1]
     * @returns {number} Linear RGB component [0-1]
     */
    srgbToLinear(c) {
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    },

    /**
     * Convert linear RGB to sRGB component
     * Applies gamma correction (gamma = 2.4)
     * 
     * @param {number} c - Linear RGB component [0-1]
     * @returns {number} sRGB component [0-1]
     */
    linearToSrgb(c) {
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    },

    /**
     * Convert hex color to RGB components
     * 
     * @param {string} hex - Hex color (e.g., '#3b82f6')
     * @returns {{r: number, g: number, b: number}} RGB components [0-1]
     */
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    },

    /**
     * Convert RGB components to hex color
     * 
     * @param {number} r - Red component [0-1]
     * @param {number} g - Green component [0-1]
     * @param {number} b - Blue component [0-1]
     * @returns {string} Hex color (e.g., '#3b82f6')
     */
    rgbToHex(r, g, b) {
        const toHex = (c) => {
            const hex = Math.round(Math.max(0, Math.min(255, c * 255))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    },

    /**
     * Convert sRGB to XYZ color space (D65 illuminant)
     * 
     * @param {number} r - Red component [0-1]
     * @param {number} g - Green component [0-1]
     * @param {number} b - Blue component [0-1]
     * @returns {{x: number, y: number, z: number}} XYZ components
     */
    srgbToXyz(r, g, b) {
        // Convert to linear RGB
        const rLin = this.srgbToLinear(r);
        const gLin = this.srgbToLinear(g);
        const bLin = this.srgbToLinear(b);

        // sRGB to XYZ matrix (D65 illuminant)
        const x = rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375;
        const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.0721750;
        const z = rLin * 0.0193339 + gLin * 0.1191920 + bLin * 0.9503041;

        return { x: x * 100, y: y * 100, z: z * 100 };
    },

    /**
     * Convert XYZ to sRGB color space
     * 
     * @param {number} x - X component
     * @param {number} y - Y component
     * @param {number} z - Z component
     * @returns {{r: number, g: number, b: number}} RGB components [0-1]
     */
    xyzToSrgb(x, y, z) {
        // Normalize XYZ
        x /= 100;
        y /= 100;
        z /= 100;

        // XYZ to linear RGB matrix
        let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
        let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
        let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

        // Convert to sRGB
        r = this.linearToSrgb(r);
        g = this.linearToSrgb(g);
        b = this.linearToSrgb(b);

        return { r, g, b };
    },

    /**
     * Convert XYZ to LAB color space
     * 
     * @param {number} x - X component
     * @param {number} y - Y component
     * @param {number} z - Z component
     * @returns {{L: number, a: number, b: number}} LAB components
     */
    xyzToLab(x, y, z) {
        // D65 illuminant constants
        const xn = 95.047;
        const yn = 100.000;
        const zn = 108.883;

        const fx = this.labF(x / xn);
        const fy = this.labF(y / yn);
        const fz = this.labF(z / zn);

        const L = 116 * fy - 16;
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);

        return { L, a, b };
    },

    /**
     * Convert LAB to XYZ color space
     * 
     * @param {number} L - Lightness component
     * @param {number} a - Green-red component
     * @param {number} b - Blue-yellow component
     * @returns {{x: number, y: number, z: number}} XYZ components
     */
    labToXyz(L, a, b) {
        // D65 illuminant constants
        const xn = 95.047;
        const yn = 100.000;
        const zn = 108.883;

        const fy = (L + 16) / 116;
        const fx = a / 500 + fy;
        const fz = fy - b / 200;

        const x = xn * this.labInvF(fx);
        const y = yn * this.labInvF(fy);
        const z = zn * this.labInvF(fz);

        return { x, y, z };
    },

    /**
     * LAB helper function for forward transformation
     * 
     * @param {number} t - Input value
     * @returns {number} Transformed value
     */
    labF(t) {
        const delta = 6 / 29;
        return t > delta ** 3 ? Math.pow(t, 1/3) : t / (3 * delta ** 2) + 4/29;
    },

    /**
     * LAB helper function for inverse transformation
     * 
     * @param {number} t - Input value
     * @returns {number} Transformed value
     */
    labInvF(t) {
        const delta = 6 / 29;
        return t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4/29);
    },

    /**
     * Convert hex color to LAB color space
     * 
     * @param {string} hex - Hex color (e.g., '#3b82f6')
     * @returns {{L: number, a: number, b: number}} LAB components
     */
    hexToLab(hex) {
        const rgb = this.hexToRgb(hex);
        const xyz = this.srgbToXyz(rgb.r, rgb.g, rgb.b);
        return this.xyzToLab(xyz.x, xyz.y, xyz.z);
    },

    /**
     * Convert LAB color space to hex color
     * 
     * @param {number} L - Lightness component
     * @param {number} a - Green-red component
     * @param {number} b - Blue-yellow component
     * @returns {string} Hex color (e.g., '#3b82f6')
     */
    labToHex(L, a, b) {
        const xyz = this.labToXyz(L, a, b);
        const rgb = this.xyzToSrgb(xyz.x, xyz.y, xyz.z);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
};

export default ColorScience;