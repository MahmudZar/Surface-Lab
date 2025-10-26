/**
 * Notifications Module
 * 
 * Toast notification system
 * 
 * @module notifications
 */

class NotificationManager {
    constructor() {
        this.element = null;
        this.timeout = null;
    }

    /**
     * Initialize notification system
     * Should be called once on app startup
     */
    init() {
        this.element = document.getElementById('notification');
        if (!this.element) {
            console.warn('Notification element not found');
        }
    }

    /**
     * Show notification message
     * 
     * @param {string} message - Message to display
     * @param {number} duration - Display duration in ms (default: 2000)
     */
    show(message, duration = 2000) {
        if (!this.element) return;

        // Clear existing timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Show notification
        this.element.textContent = message;
        this.element.classList.add('show');

        // Auto-hide after duration
        this.timeout = setTimeout(() => {
            this.hide();
        }, duration);
    }

    /**
     * Hide notification
     */
    hide() {
        if (this.element) {
            this.element.classList.remove('show');
        }
    }
}

// Singleton instance
const notifications = new NotificationManager();
export default notifications;