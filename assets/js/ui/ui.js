/**
 * UI Controller Module
 * 
 * Manages DOM interactions and user interface
 * 
 * @module ui
 */

import PaletteGenerator from '../core/paletteGenerator.js';
import { isValidHex, normalizeHex, validateSteps } from '../utils/validators.js';
import { exportAsCSS, exportAsJSON, exportAsSVG, copyToClipboard } from '../utils/exportUtils.js';
import notifications from './notifications.js';

class UIController {
    constructor() {
        this.currentPalette = [];
        this.elements = {};
    }

    /**
     * Initialize UI
     * Sets up event listeners and generates initial palette
     */
    init() {
        // Cache DOM elements
        this.cacheElements();

        // Initialize notifications
        notifications.init();

        // Setup event listeners
        this.setupEventListeners();

        // Generate initial palette
        this.generatePalette();
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            colorPicker: document.getElementById('colorPicker'),
            colorText: document.getElementById('colorText'),
            stepsInput: document.getElementById('stepsInput'),
            generateBtn: document.getElementById('generateBtn'),
            paletteGrid: document.getElementById('paletteGrid'),
            codePreview: document.getElementById('codePreview'),
            exportCSSBtn: document.getElementById('exportCSSBtn'),
            exportJSONBtn: document.getElementById('exportJSONBtn'),
            exportSVGBtn: document.getElementById('exportSVGBtn')
        };
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Color picker sync
        this.elements.colorPicker.addEventListener('input', (e) => {
            this.elements.colorText.value = e.target.value;
            this.generatePalette();
        });

        // Color text input sync
        this.elements.colorText.addEventListener('input', (e) => {
            const color = e.target.value;
            if (isValidHex(color)) {
                this.elements.colorPicker.value = color;
                this.generatePalette();
            }
        });

        // Steps input
        this.elements.stepsInput.addEventListener('input', () => {
            this.generatePalette();
        });

        // Generate button
        this.elements.generateBtn.addEventListener('click', () => {
            this.generatePalette();
        });

        // Export buttons
        this.elements.exportCSSBtn.addEventListener('click', () => {
            this.handleExportCSS();
        });

        this.elements.exportJSONBtn.addEventListener('click', () => {
            this.handleExportJSON();
        });

        this.elements.exportSVGBtn.addEventListener('click', () => {
            this.handleExportSVG();
        });
    }

    /**
     * Generate palette from current inputs
     */
    generatePalette() {
        const baseColor = normalizeHex(this.elements.colorText.value);
        const steps = parseInt(this.elements.stepsInput.value);

        // Validate inputs
        if (!isValidHex(baseColor)) {
            console.warn('Invalid hex color');
            return;
        }

        if (!validateSteps(steps)) {
            console.warn('Invalid steps value');
            return;
        }

        // Generate palette using core algorithm
        try {
            this.currentPalette = PaletteGenerator.generateUniformScale(baseColor, steps);
            this.renderPalette();
            this.updateCodePreview();
        } catch (error) {
            console.error('Error generating palette:', error);
            notifications.show('Error generating palette', 2000);
        }
    }

    /**
     * Render palette to DOM
     */
    renderPalette() {
        const html = this.currentPalette.map((color) => `
            <div class="color-card ${color.isBase ? 'is-base' : ''}" data-color="${color.hex}">
                <div class="color-preview" style="background-color: ${color.hex}"></div>
                <div class="color-info">
                    <div class="color-name">${color.name}</div>
                    <div class="color-value">${color.hex}</div>
                    <div class="color-lightness">L*: ${color.lightness}</div>
                </div>
            </div>
        `).join('');

        this.elements.paletteGrid.innerHTML = html;

        // Add click listeners to color cards
        this.elements.paletteGrid.querySelectorAll('.color-card').forEach(card => {
            card.addEventListener('click', () => {
                const color = card.dataset.color;
                this.copyColor(color);
            });
        });
    }

    /**
     * Update code preview section
     */
    updateCodePreview() {
        const css = exportAsCSS(this.currentPalette);
        this.elements.codePreview.textContent = css;
    }

    /**
     * Copy individual color
     */
    async copyColor(color) {
        try {
            await copyToClipboard(color);
            notifications.show(`Color ${color} copied!`);
        } catch (err) {
            notifications.show('Failed to copy color');
        }
    }

    /**
     * Handle CSS export
     */
    async handleExportCSS() {
        try {
            const css = exportAsCSS(this.currentPalette);
            await copyToClipboard(css);
            notifications.show('CSS copied to clipboard!');
        } catch (err) {
            notifications.show('Failed to copy CSS');
        }
    }

    /**
     * Handle JSON export
     */
    async handleExportJSON() {
        try {
            const json = exportAsJSON(this.currentPalette);
            await copyToClipboard(json);
            notifications.show('JSON copied to clipboard!');
        } catch (err) {
            notifications.show('Failed to copy JSON');
        }
    }

    /**
     * Handle SVG export
     */
    async handleExportSVG() {
        try {
            const svg = exportAsSVG(this.currentPalette);
            await copyToClipboard(svg);
            notifications.show('Scientific SVG copied! Ready for Figma.');
        } catch (err) {
            notifications.show('Failed to copy SVG');
        }
    }
}

// Singleton instance
const ui = new UIController();
export default ui;