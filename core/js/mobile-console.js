/**
 * Mobile Console Debug System
 * 
 * Provides a mobile-friendly console overlay that captures browser console output
 * and displays it in a dropdown interface with copy-to-clipboard functionality.
 * 
 * Features:
 * - Captures console.log, console.warn, console.error, console.info
 * - Displays app version and current state in button label
 * - Full-screen scrollable console with color-coded messages
 * - Copy to clipboard functionality with visual feedback
 * - Auto-updates when app state changes
 */

class MobileConsole {
    constructor() {
        this.debugConsoleOpen = false;
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        this.version = 'unknown'; // Will be set by the main app
        this.init();
    }

    init() {
        this.overrideConsoleMethods();
        this.updateDebugInfo();
        this.hookIntoStateChanges();
    }

    // Override console methods to capture output
    overrideConsoleMethods() {
        console.log = (...args) => {
            this.originalConsole.log.apply(console, args);
            this.addToMobileConsole('log', args.join(' '));
        };
        
        console.warn = (...args) => {
            this.originalConsole.warn.apply(console, args);
            this.addToMobileConsole('warn', args.join(' '));
        };
        
        console.error = (...args) => {
            this.originalConsole.error.apply(console, args);
            this.addToMobileConsole('error', args.join(' '));
        };
        
        console.info = (...args) => {
            this.originalConsole.info.apply(console, args);
            this.addToMobileConsole('info', args.join(' '));
        };
    }

    // Add message to mobile console
    addToMobileConsole(type, message) {
        const consoleOutput = document.getElementById('console-output');
        if (!consoleOutput) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `console-${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        consoleOutput.appendChild(logEntry);
        
        // Auto-scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        // Limit console entries to prevent memory issues
        const entries = consoleOutput.children;
        if (entries.length > 100) {
            consoleOutput.removeChild(entries[0]);
        }
    }

    // Toggle debug console
    toggleDebugConsole() {
        const console = document.getElementById('debug-console');
        const arrow = document.getElementById('debug-arrow');
        
        this.debugConsoleOpen = !this.debugConsoleOpen;
        
        if (this.debugConsoleOpen) {
            console.classList.remove('hidden');
            arrow.classList.add('expanded');
        } else {
            console.classList.add('hidden');
            arrow.classList.remove('expanded');
        }
    }

    // Update debug info with current app state
    updateDebugInfo() {
        const debugInfo = document.getElementById('debug-info');
        if (!debugInfo) return;
        
        const currentState = window.stateManager ? window.stateManager.getCurrentState() : 'unknown';
        debugInfo.textContent = `v${this.version} - ${currentState}`;
    }

    // Copy console output to clipboard
    copyConsoleToClipboard() {
        const consoleOutput = document.getElementById('console-output');
        if (!consoleOutput) return;
        
        // Collect all console entries
        const entries = Array.from(consoleOutput.children);
        const consoleText = entries.map(entry => entry.textContent).join('\n');
        
        // Add header with app info
        const currentState = window.stateManager ? window.stateManager.getCurrentState() : 'unknown';
        const timestamp = new Date().toLocaleString();
        const fullText = `AR Learning App Console Output\nVersion: ${this.version}\nState: ${currentState}\nTimestamp: ${timestamp}\n\n${consoleText}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(fullText).then(() => {
            this.showCopyFeedback();
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            this.fallbackCopy(fullText);
        });
    }

    // Show visual feedback for successful copy
    showCopyFeedback() {
        const copyBtn = document.getElementById('copy-console-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'var(--primary-color)';
        }, 2000);
    }

    // Fallback copy method for older browsers
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showCopyFeedback();
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
    }

    // Hook into state changes to update debug info
    hookIntoStateChanges() {
        if (window.stateManager) {
            const originalChangeState = window.stateManager.changeState.bind(window.stateManager);
            window.stateManager.changeState = (newState) => {
                const result = originalChangeState(newState);
                // Update debug info after state change
                setTimeout(() => this.updateDebugInfo(), 10);
                return result;
            };
        }
    }

    // Set app version (called by main app)
    setVersion(version) {
        this.version = version;
        this.updateDebugInfo();
    }
}

// Global functions for HTML onclick handlers
let mobileConsole;

function toggleDebugConsole() {
    if (mobileConsole) {
        mobileConsole.toggleDebugConsole();
    }
}

function copyConsoleToClipboard() {
    if (mobileConsole) {
        mobileConsole.copyConsoleToClipboard();
    }
}

// Initialize mobile console when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    mobileConsole = new MobileConsole();
    
    // Make mobileConsole globally accessible
    window.mobileConsole = mobileConsole;
});
