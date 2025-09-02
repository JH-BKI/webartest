/**
 * Progress Manager - Handles topic completion tracking and persistence
 * 
 * Features:
 * - Track completed topics in memory
 * - Save/load progress from localStorage
 * - Update UI with completion status and topic names
 * - Provide testing functions for development
 * 
 * Integration:
 * - Called when user completes summary (topic marked as complete)
 * - Updates menu UI with completion status
 * - Persists across browser sessions
 */

class ProgressManager {
    constructor() {
        this.completedTopics = new Set(); // Use Set for efficient lookups
        this.storageKey = 'arLearningApp_progress';
        this.loadProgress();
        console.log('ProgressManager initialized. Completed topics:', Array.from(this.completedTopics));
    }

    /**
     * Mark a topic as completed
     * @param {number} topicNumber - Topic number (1-4)
     */
    markTopicCompleted(topicNumber) {
        if (topicNumber >= 1 && topicNumber <= 4) {
            this.completedTopics.add(topicNumber);
            this.saveProgress();
            this.updateMenuUI();
            console.log(`Topic ${topicNumber} marked as completed. Total completed: ${this.completedTopics.size}/4`);
        } else {
            console.error('Invalid topic number:', topicNumber);
        }
    }

    /**
     * Check if a topic is completed
     * @param {number} topicNumber - Topic number (1-4)
     * @returns {boolean}
     */
    isTopicCompleted(topicNumber) {
        return this.completedTopics.has(topicNumber);
    }

    /**
     * Get all completed topic numbers
     * @returns {Array<number>}
     */
    getCompletedTopics() {
        return Array.from(this.completedTopics).sort();
    }

    /**
     * Get completion count
     * @returns {number}
     */
    getCompletionCount() {
        return this.completedTopics.size;
    }

    /**
     * Get completion percentage
     * @returns {number}
     */
    getCompletionPercentage() {
        return Math.round((this.completedTopics.size / 4) * 100);
    }

    /**
     * Get completed topic names
     * @returns {Array<string>}
     */
    getCompletedTopicNames() {
        return this.getCompletedTopics().map(topicNumber => {
            return window.getTopicTitle ? window.getTopicTitle(topicNumber) : `Topic ${topicNumber}`;
        });
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progressData = {
                completedTopics: Array.from(this.completedTopics),
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(progressData));
            console.log('Progress saved to localStorage:', progressData);
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const progressData = JSON.parse(savedData);
                this.completedTopics = new Set(progressData.completedTopics || []);
                console.log('Progress loaded from localStorage:', progressData);
            } else {
                console.log('No saved progress found, starting fresh');
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
            this.completedTopics = new Set(); // Reset on error
        }
    }

    /**
     * Update the menu UI with current progress
     */
    updateMenuUI() {
        const completionCount = this.getCompletionCount();
        const completedTopicNames = this.getCompletedTopicNames();
        
        // Update progress counter
        const progressCounter = document.querySelector('#progress-counter');
        if (progressCounter) {
            progressCounter.textContent = `${completionCount} of 4 completed`;
        }

        // Update completed topics list
        const completedTopicsList = document.querySelector('#completed-topics-list');
        if (completedTopicsList) {
            if (completedTopicNames.length > 0) {
                completedTopicsList.innerHTML = completedTopicNames
                    .map(name => `<li class="completed-topic-item">✓ ${name}</li>`)
                    .join('');
                completedTopicsList.style.display = 'block';
            } else {
                completedTopicsList.innerHTML = '';
                completedTopicsList.style.display = 'none';
            }
        }

        // Update progress bar if it exists
        const progressBar = document.querySelector('#progress-bar');
        if (progressBar) {
            const percentage = this.getCompletionPercentage();
            progressBar.style.width = `${percentage}%`;
        }

        console.log('Menu UI updated with progress:', {
            count: completionCount,
            topics: completedTopicNames
        });
    }

    /**
     * Clear all progress (for testing)
     */
    clearAllProgress() {
        this.completedTopics.clear();
        this.saveProgress();
        this.updateMenuUI();
        console.log('All progress cleared');
    }

    /**
     * Set specific topics as completed (for testing)
     * @param {Array<number>} topicNumbers - Array of topic numbers to mark as completed
     */
    setCompletedTopics(topicNumbers) {
        this.completedTopics.clear();
        topicNumbers.forEach(topicNumber => {
            if (topicNumber >= 1 && topicNumber <= 4) {
                this.completedTopics.add(topicNumber);
            }
        });
        this.saveProgress();
        this.updateMenuUI();
        console.log('Progress set to:', Array.from(this.completedTopics));
    }

    /**
     * Get progress summary for debugging
     * @returns {Object}
     */
    getProgressSummary() {
        return {
            completedTopics: this.getCompletedTopics(),
            completedTopicNames: this.getCompletedTopicNames(),
            completionCount: this.getCompletionCount(),
            completionPercentage: this.getCompletionPercentage(),
            totalTopics: 4
        };
    }
}

// Create global instance
window.progressManager = new ProgressManager();

// Testing functions (available in console)
window.testProgress = {
    /**
     * Clear all progress
     */
    clear: () => {
        window.progressManager.clearAllProgress();
        console.log('Progress cleared. Call testProgress.show() to see current state.');
    },

    /**
     * Mark specific topics as completed
     * @param {Array<number>} topics - Array of topic numbers (1-4)
     */
    set: (topics) => {
        window.progressManager.setCompletedTopics(topics);
        console.log('Progress set. Call testProgress.show() to see current state.');
    },

    /**
     * Mark all topics as completed
     */
    completeAll: () => {
        window.progressManager.setCompletedTopics([1, 2, 3, 4]);
        console.log('All topics marked as completed. Call testProgress.show() to see current state.');
    },

    /**
     * Show current progress summary
     */
    show: () => {
        const summary = window.progressManager.getProgressSummary();
        console.table(summary);
        return summary;
    },

    /**
     * Mark a single topic as completed
     * @param {number} topicNumber - Topic number (1-4)
     */
    complete: (topicNumber) => {
        window.progressManager.markTopicCompleted(topicNumber);
        console.log(`Topic ${topicNumber} marked as completed. Call testProgress.show() to see current state.`);
    }
};

console.log('Progress Manager loaded. Use testProgress.show() to see current progress, or testProgress.clear() to reset.');
