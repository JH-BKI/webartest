// Simple State Manager for the learning app
class StateManager {
    constructor() {
        this.currentState = 'loading'; // Start with loading state
        this.states = {
            loading: {
                onEnter: () => {
                    console.log('Entering loading state');
                    // Show loading screen
                    this.hideAllSections();
                    // Note: loading section will be created in HTML
                },
                onExit: () => {
                    console.log('Exiting loading state');
                }
            },
            campus_selection: {
                onEnter: () => {
                    console.log('Entering campus selection state');
                    this.hideAllSections();
                    // Show campus selection section
                    const campusSection = document.getElementById('campus-selection');
                    if (campusSection) {
                        campusSection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting campus selection state');
                }
            },
            menu: {
                onEnter: () => {
                    console.log('Entering menu state');
                    this.hideAllSections();
                    // Show menu section
                    const menuSection = document.getElementById('menu-section');
                    if (menuSection) {
                        menuSection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting menu state');
                }
            },
            scanning: {
                onEnter: () => {
                    console.log('Entering scanning state');
                    this.hideAllSections();
                    // Show scanning section
                    const scanningSection = document.getElementById('scanning-section');
                    if (scanningSection) {
                        scanningSection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting scanning state');
                }
            },
            ar_ready: {
                onEnter: () => {
                    console.log('Entering AR ready state');
                    this.hideAllSections();
                    // Show AR ready section
                    const arReadySection = document.getElementById('ar-ready-section');
                    if (arReadySection) {
                        arReadySection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting AR ready state');
                }
            },
            animating: {
                onEnter: () => {
                    console.log('Entering animating state');
                    this.hideAllSections();
                    // Show animating section
                    const animatingSection = document.getElementById('animating-section');
                    if (animatingSection) {
                        animatingSection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting animating state');
                }
            },
            topics: {
                onEnter: () => {
                    console.log('Entering topics state');
                    // Hide all sections except topics
                    this.hideAllSections();
                    document.getElementById('topics').classList.remove('hidden');
                },
                onExit: () => {
                    console.log('Exiting topics state');
                    document.getElementById('topics').classList.add('hidden');
                }
            },
            video: {
                onEnter: () => {
                    console.log('Entering video state');
                    this.hideAllSections();
                    document.getElementById('progress').classList.remove('hidden');
                    document.getElementById('video-section').classList.remove('hidden');
                },
                onExit: () => {
                    console.log('Exiting video state');
                    document.getElementById('progress').classList.add('hidden');
                    document.getElementById('video-section').classList.add('hidden');
                }
            },
            quiz: {
                onEnter: () => {
                    console.log('Entering quiz state');
                    this.hideAllSections();
                    document.getElementById('progress').classList.remove('hidden');
                    document.getElementById('quiz-section').classList.remove('hidden');
                },
                onExit: () => {
                    console.log('Exiting quiz state');
                    document.getElementById('quiz-section').classList.add('hidden');
                }
            },
            summary: {
                onEnter: () => {
                    console.log('Entering summary state');
                    this.hideAllSections();
                    document.getElementById('progress').classList.remove('hidden');
                    document.getElementById('summary-section').classList.remove('hidden');
                },
                onExit: () => {
                    console.log('Exiting summary state');
                    document.getElementById('summary-section').classList.add('hidden');
                }
            }
        };
    }

    // Change to a new state
    changeState(newState) {
        if (!this.states[newState]) {
            console.error(`Invalid state: ${newState}`);
            return false;
        }

        if (this.currentState === newState) {
            console.log(`Already in state: ${newState}`);
            return true;
        }

        // Exit current state
        if (this.states[this.currentState].onExit) {
            this.states[this.currentState].onExit();
        }

        // Update current state
        this.currentState = newState;

        // Enter new state
        if (this.states[this.currentState].onEnter) {
            this.states[this.currentState].onEnter();
        }

        console.log(`State changed to: ${newState}`);
        return true;
    }

    // Get current state
    getCurrentState() {
        return this.currentState;
    }

    // Check if currently in a specific state
    isInState(state) {
        return this.currentState === state;
    }

    // Helper method to hide all sections
    hideAllSections() {
        const sections = [
            'topics', 
            'progress', 
            'video-section', 
            'quiz-section', 
            'summary-section', 
            'loading-section', 
            'campus-selection', 
            'menu-section', 
            'scanning-section', 
            'ar-ready-section', 
            'animating-section'];
            
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    // Add a new state (for future extensibility)
    addState(stateName, onEnter, onExit) {
        this.states[stateName] = {
            onEnter: onEnter || (() => {}),
            onExit: onExit || (() => {})
        };
        console.log(`Added new state: ${stateName}`);
    }
}

// Create and make stateManager available globally
window.stateManager = new StateManager();