/**
 * SurfaceLab Main Entry Point
 * 
 * Application initialization and setup
 * 
 * @module main
 * @version 2.0.0
 */

import UI from './ui/ui.js';
import ColorScience from './core/colorScience.js';
import PaletteGenerator from './core/paletteGenerator.js';

/**
 * Application initialization
 */
function initApp() {
    console.log('🎨 SurfaceLab v2.2.0 - Surface Colors Algorithm');
    console.log('Initializing application...');

    try {
        // Initialize UI
        UI.init();
        console.log('✅ UI initialized successfully');
        
        // Test chroma scaling formula
        PaletteGenerator.testChromaScaling();
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showFatalError('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Show fatal error to user
 */
function showFatalError(message) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="
                background: #dc2626;
                color: white;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
                margin-top: 2rem;
            ">
                <h2>Application Error</h2>
                <p>${message}</p>
            </div>
        `;
    }
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

/**
 * Global unhandled rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/**
 * Start application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded
    initApp();
}

/**
 * Expose API for debugging in development
 * Access via window.SurfaceLab in browser console
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.SurfaceLab = {
        ColorScience,
        PaletteGenerator,
        version: '2.2.0',

        // Utility for testing
        test: {
            generatePalette: (color, steps) => {
                return PaletteGenerator.generateUniformScale(color, steps);
            },
            hexToLab: (hex) => {
                return ColorScience.hexToLab(hex);
            }
        }
    };

    console.log('🔧 Development mode: window.SurfaceLab API exposed');
}

export { initApp };