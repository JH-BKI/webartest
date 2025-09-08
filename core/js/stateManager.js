// Simple State Manager for the learning app
class StateManager {
    constructor() {
        this.currentState = 'none';  //'loading'; // Start with loading state
        this.states = {
            none: {
                onEnter: () => {
                    console.log('Entering none state');
                },
                onExit: () => {
                    console.log('Exiting none state');
                }
            },

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
                    const campusSection = document.getElementById('campus-section');
                    if (campusSection) {
                        campusSection.classList.remove('hidden');
                    }
                },
                onExit: () => {
                    console.log('Exiting campus selection state');
                }
            },
            onboarding: {
                onEnter: () => {
                    console.log('Entering onboarding state');
                },
                onExit: () => {
                    console.log('Exiting onboarding state');
                }
            },
            help: {
                onEnter: () => {
                    console.log('Entering help state');
                },
                onExit: () => {
                    console.log('Exiting help state');
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
                    // Refresh progress display when entering menu
                    if (window.progressManager) {
                        window.progressManager.updateMenuUI();
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
                    
                    // Start MindAR camera and resume AR scene when entering scanning state
                    if (window.arSceneManager) {
                        window.arSceneManager.startMindAR();
                        window.arSceneManager.resumeScene();
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
                    
                    // Keep MindAR camera running and resume AR scene when entering ar_ready state
                    if (window.arSceneManager) {
                        window.arSceneManager.resumeScene();
                    }
                    
                    // Auto-trigger countdown for start button
                    const startButton = document.getElementById('start-ar-button');
                    if (startButton && typeof window.countdownTimer === 'function') {
                        setTimeout(() => {
                            window.countdownTimer(5, window.startARExperience, startButton);
                        }, 500);
                    }
                },
                onExit: () => {
                    console.log('Exiting AR ready state');
                }
            },
            animating: {
                onEnter: () => {

            // // Start the animation timeline
            // this.startAnimation(topicId);

                    console.log('Entering animating state');
                    this.hideAllSections();
                    // Show animating section
                    const animatingSection = document.getElementById('animating-section');
                    if (animatingSection) {
                        animatingSection.classList.remove('hidden');
                    }
                    
                    // Keep MindAR camera running and resume AR scene when entering animating state
                    if (window.arSceneManager) {
                        window.arSceneManager.resumeScene();
                    }
                },
                onExit: () => {
                    console.log('Exiting animating state');
                    // Stop MindAR camera and pause AR scene when showing fullscreen video
                    console.log('Stopping MindAR camera and pausing AR scene when exiting animating state');
                    if (window.arSceneManager) {
                        window.arSceneManager.stopMindAR();
                        window.arSceneManager.pauseScene();
                    }
                    
                    // Stop the timeline completely when transitioning to video
                    if (window.timelineController) {
                        console.log('🛑 Stopping timeline when transitioning to video state');
                        window.timelineController.resetTimeline();
                    }
                }
            },
            video: {
                onEnter: () => {
                    console.log('Entering video state');
                    this.hideAllSections();
                    // document.getElementById('progress').classList.remove('hidden');
                    const videoSection = document.getElementById('video-section');
                    if (videoSection) {
                        // Load video content after state transition
                        if (typeof window.loadVideoContent === 'function') {
                            console.log('🎬 Loading video content after timeline completion');
                            window.loadVideoContent();
                        } else {
                            console.error('❌ loadVideoContent function not available');
                        }
                        videoSection.classList.remove('hidden');
                        console.log('✅ Video section shown');
                    } else {
                        console.error('❌ Video section not found!');
                    }
                    
                    // Ensure MindAR camera is stopped for fullscreen video
                    if (window.arSceneManager) {
                        window.arSceneManager.stopMindAR();
                    }
                    
                },
                onExit: () => {
                    console.log('Exiting video state');
                    //document.getElementById('progress').classList.add('hidden');
                    document.getElementById('video-section').classList.add('hidden');
                }
            },
            quiz: {
                onEnter: () => {
                    console.log('Entering quiz state');
                    this.hideAllSections();
                    //document.getElementById('progress').classList.remove('hidden');
                    document.getElementById('quiz-section').classList.remove('hidden');
                    
                    // Stop MindAR camera and pause AR scene when showing fullscreen quiz
                    if (window.arSceneManager) {
                        window.arSceneManager.stopMindAR();
                        window.arSceneManager.pauseScene();
                    }
                    
                    // Stop the timeline completely when transitioning to quiz
                    if (window.timelineController) {
                        console.log('🛑 Stopping timeline when transitioning to quiz state');
                        window.timelineController.resetTimeline();
                    }
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
                    //document.getElementById('progress').classList.remove('hidden');
                    document.getElementById('summary-section').classList.remove('hidden');
                    
                    // Stop MindAR camera and pause AR scene when showing fullscreen summary
                    if (window.arSceneManager) {
                        window.arSceneManager.stopMindAR();
                        window.arSceneManager.pauseScene();
                    }
                    
                    // Stop the timeline completely when transitioning to summary
                    if (window.timelineController) {
                        console.log('🛑 Stopping timeline when transitioning to summary state');
                        window.timelineController.resetTimeline();
                    }
                },
                onExit: () => {
                    console.log('Exiting summary state');
                    document.getElementById('summary-section').classList.add('hidden');
                }
            },
            face_filter_setup: {
                onEnter: () => {
                    console.log('Entering face_filter state');
                },
                onExit: () => {
                    console.log('Exiting face_filter state');
                }
            },
            face_filter_scanning: {
                onEnter: () => {
                    console.log('Entering face_filter state');
                },
                onExit: () => {
                    console.log('Exiting face_filter state');
                }
            },
            face_filter_ready: {
                onEnter: () => {
                    console.log('Entering face_filter state');
                },
                onExit: () => {
                    console.log('Exiting face_filter state');
                }
            },
            face_filter_animating: {
                onEnter: () => {
                    console.log('Entering face_filter state');
                },
                onExit: () => {
                    console.log('Exiting face_filter state');
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
            'loading-section', 
            'campus-section', 
            'onboarding-section',
            'help',
            'menu-section', 
            'scanning-section', 
            'ar-ready-section', 
            'animating-section',
            'video-section', 
            'quiz-section', 
            'summary-section',
            'face-filter'
            ];
            
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

// Debug function to show complete app status
function debugAppStatus() {
  console.log('📊 APP STATUS OVERVIEW');
  console.log('====================');
  
  // Current state from stateManager
  if (window.stateManager) {
    console.log('🔄 Current State:', window.stateManager.getCurrentState());
  } else {
    console.log('❌ StateManager not available');
  }
  
  // Current topic
  if (typeof currentTopic !== 'undefined') {
    console.log('📚 Current Topic:', currentTopic || 'None selected');
  } else {
    console.log('❌ currentTopic variable not available');
  }
  
  // Campus selection
  if (typeof selectedCampus !== 'undefined') {
    console.log('🏫 Selected Campus:', selectedCampus || 'None selected');
  } else {
    console.log('❌ selectedCampus variable not available');
  }
  
  // Quiz progress
  if (typeof currentScore !== 'undefined') {
    console.log('📝 Current Score:', currentScore);
  } else {
    console.log('❌ currentScore variable not available');
  }
  
  if (typeof selectedAnswers !== 'undefined') {
    console.log('✅ Selected Answers:', selectedAnswers);
  } else {
    console.log('❌ selectedAnswers variable not available');
  }
  
  // Progress tracking
  if (window.progressManager) {
    const progress = window.progressManager.getProgressSummary();
    console.log('📈 Progress Summary:', progress);
  } else {
    console.log('❌ ProgressManager not available');
  }
  
  console.log('====================');
  console.log('💡 Use debugCurrentTopic() to see current topic details');
  console.log('💡 Use testProgress.show() to see detailed progress info');
}

// Create and make stateManager available globally
window.stateManager = new StateManager();

// Test function for AR scene pause/resume functionality
function testARSceneControl() {
    console.log('🧪 Testing AR Scene Control...');
    
    if (window.arSceneManager) {
        const isPaused = window.arSceneManager.isScenePaused();
        console.log(`Current pause state: ${isPaused ? 'PAUSED' : 'RUNNING'}`);
        
        if (isPaused) {
            console.log('▶️ Resuming AR scene...');
            window.arSceneManager.resumeScene();
        } else {
            console.log('⏸️ Pausing AR scene...');
            window.arSceneManager.pauseScene();
        }
    } else {
        console.error('❌ AR Scene Manager not available');
    }
}

// Make debug function available globally
window.debugAppStatus = debugAppStatus;

// Make test function available globally
window.testARSceneControl = testARSceneControl;