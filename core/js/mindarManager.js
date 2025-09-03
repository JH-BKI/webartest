// MindAR Manager - Unified Version for Phase 3B
// This module handles AR poster detection with configurable simulation/real modes
// Supports both simulated detection and real MindAR camera integration

class MindARManager {
  constructor(config = {}) {
    // Configuration options
    this.mode = config.mode || 'auto'; // 'simulated', 'real', or 'auto'
    this.simulationDelay = config.simulationDelay || 3000; // ms
    this.defaultTarget = config.defaultTarget || 0; // Default target for simulation
    
    // State management
    this.isInitialized = false;
    this.currentTopic = null;
    this.isScanning = false;
    this.stateManager = null;
    this.timelineController = null;
    
    // Real MindAR components (A-Frame integration)
    // Note: A-Frame scenes are managed by AR Scene Manager
    
    // Topic mapping: target index -> topic number
    this.topicMapping = {
      0: 1, // Target 0 -> topic_1 (Web Development)
      1: 2, // Target 1 -> topic_2 (Digital Marketing)  
      2: 3, // Target 2 -> topic_3 (Data Science)
      3: 4  // Target 3 -> topic_4 (Cybersecurity)
    };
    
    // Topic names for UI display - dynamically loaded from topics.js
    this.topicNames = {
      1: 'topic_1', // Will be resolved to actual title from topics.js
      2: 'topic_2', // Will be resolved to actual title from topics.js
      3: 'topic_3', // Will be resolved to actual title from topics.js
      4: 'topic_4'  // Will be resolved to actual title from topics.js
    };
    
    // Poster ID mapping for demo buttons
    this.posterMapping = {
      'poster_1': 0,
      'poster_2': 1, 
      'poster_3': 2,
      'poster_4': 3
    };
    
    console.log(`MindAR Manager initialized (mode: ${this.mode})`);
  }

  // Initialize the MindAR system based on mode
  async initialize() {
    console.log('🚀 MindAR Manager: Starting A-Frame AR scene (simplified)');
    // A-Frame will handle all MindAR operations
    return Promise.resolve();
  }

  // Initialize in simulated mode
  async initializeSimulated() {
    console.log('Initializing simulated MindAR system...');
    
    // Simulate initialization delay
    await this.simulateDelay(1000);
    
    this.isInitialized = true;
    console.log('Simulated MindAR system initialized successfully');
    return true;
  }

  // Initialize in real mode
  async initializeReal() {
    console.log('📷 MindAR Manager: Initializing real MindAR system...');
    
    // Check if MindAR is available
    console.log('🔍 MindAR Manager: Checking if MindAR library is loaded...');
    if (typeof window.MINDAR === 'undefined') {
      console.error('❌ MindAR Manager: MindAR library not loaded');
      this.showARNotSupported();
      return false;
    }
    console.log('✅ MindAR Manager: MindAR library is loaded');

    // Check if camera is available
    console.log('🔍 MindAR Manager: Checking camera availability...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('❌ MindAR Manager: Camera not available on this device');
      this.showARNotSupported();
      return false;
    }
    console.log('✅ MindAR Manager: Camera is available');

    // Initialize MindAR with A-Frame (MindARImage)
    // Note: We'll let the AR Scene Manager handle the actual A-Frame scene creation
    // This manager will focus on detection logic and state management
    console.log('📝 MindAR Manager: Setting up target listeners for A-Frame integration');
    
    // Set up event listeners for target detection
    this.setupTargetListeners();

    this.isInitialized = true;
    console.log('Real MindAR system initialized successfully');
    return true;
  }

  // Initialize in auto mode (try real, fallback to simulated)
  async initializeAuto() {
    console.log('🔄 MindAR Manager: Attempting auto-initialization (real first, simulated fallback)...');
    
    try {
      // Try real mode first
      console.log('📷 MindAR Manager: Trying real mode first...');
      const success = await this.initializeReal();
      if (success) {
        this.mode = 'real'; // Lock to real mode
        console.log('✅ MindAR Manager: Real mode successful - locked to real mode');
        return true;
      }
    } catch (error) {
      console.log('⚠️ MindAR Manager: Real mode failed, falling back to simulated:', error.message);
    }
    
    // Fallback to simulated mode
    console.log('🎭 MindAR Manager: Falling back to simulated mode');
    this.mode = 'simulated';
    return await this.initializeSimulated();
  }

  // Create or get AR container element (real mode only)
  getOrCreateARContainer() {
    let container = document.getElementById('ar-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ar-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '1000';
      container.style.display = 'none';
      document.body.appendChild(container);
    }
    return container;
  }

  // Set up target detection event listeners (real mode only)
  setupTargetListeners() {
    console.log('📝 MindAR Manager: A-Frame will handle target detection');
    // A-Frame scene handles all target detection
  }

  // Start scanning based on current mode
  async startScanning() {
    console.log('📷 MindAR Manager: A-Frame will handle scanning');
    // A-Frame scene handles all scanning operations
    return Promise.resolve();
  }

  // Start simulated scanning
  startSimulatedScanning() {
    this.isScanning = true;
    console.log('Started simulated AR scanning...');
    
    // Simulate scanning process
    this.simulateScanning();
    return true;
  }

  // Start real camera scanning
  async startRealScanning() {
    try {
      this.isScanning = true;
      console.log('Started real AR camera scanning...');
      
      // The AR Scene Manager will handle the actual A-Frame scene creation
      // This manager focuses on detection logic and state management
      
      console.log('Real camera scanning active (A-Frame integration)...');
      return true;
    } catch (error) {
      console.error('Failed to start real scanning:', error);
      this.handleScanningError(error);
      return false;
    }
  }

  // Stop scanning
  stopScanning() {
    if (!this.isScanning) return;
    
    this.isScanning = false;
    console.log(`Stopped ${this.mode} AR scanning`);
    
    // The AR Scene Manager will handle scene disposal
    // This manager focuses on state management
  }

  // Simulate the scanning process (simulated mode only)
  simulateScanning() {
    if (!this.isScanning || this.mode !== 'simulated') return;
    
    console.log('Scanning in progress... (simulated)');
    
    // Simulate finding a poster after configured delay
    setTimeout(() => {
      if (this.isScanning) {
        this.simulatePosterDetection(this.defaultTarget);
      }
    }, this.simulationDelay);
  }

  // Simulate poster detection (simulated mode only)
  simulatePosterDetection(targetIndex) {
    if (!this.isScanning || this.mode !== 'simulated') return;
    
    console.log(`🎯 Simulated poster detected: target ${targetIndex}`);
    this.handleTargetFound(targetIndex);
  }

  // Handle when a target is found (both modes)
  handleTargetFound(targetIndex) {
    if (this.currentTopic !== null) {
      // Already processing a topic, ignore additional detections
      return;
    }

    const topicId = this.topicMapping[targetIndex];
    if (topicId !== undefined) {
      this.currentTopic = topicId;
      // Set current topic in the main app
      if (typeof setCurrentTopic === 'function') {
        setCurrentTopic(`topic_${topicId}`);
      }
      console.log(`📚 Topic identified: ${topicId} (${this.topicNames[topicId]})`);
      
      // Stop scanning
      this.stopScanning();
      
      // Update UI with detected poster info
      this.updateDetectedPosterUI(topicId);
      
      // Transition to AR ready state
      this.transitionToARReady(topicId);
    } else {
      console.warn(`Unknown target index: ${targetIndex}`);
    }
  }

  // Handle when a target is lost (real mode only)
  handleTargetLost(targetIndex) {
    console.log(`Target ${targetIndex} lost from view`);
    // Could implement logic to handle target loss if needed
  }

  // Update UI when poster is detected
  updateDetectedPosterUI(topicId) {
    // Get the actual topic title from topics.js
    const topicTitle = window.getTopicTitle ? window.getTopicTitle(topicId + 1) : `Topic ${topicId + 1}`;
    
    // Update detected poster information
    const titleElement = document.getElementById('detected-poster-title');
    const nameElement = document.getElementById('detected-topic-name');
    
    if (titleElement) {
      titleElement.textContent = `${topicTitle} Poster Detected`;
    }
    
    if (nameElement) {
      nameElement.textContent = topicTitle;
    }
    
    console.log(`🎨 UI updated for topic: ${topicTitle}`);
  }

  // Transition to AR ready state
  transitionToARReady(topicId) {
    console.log(`🎉 Poster found! Transitioning to AR experience for topic ${topicId}`);
    
    // Create AR scene for the detected topic
    if (window.arSceneManager) {
      window.arSceneManager.createSceneForDetectedTopic(topicId).then(() => {
        console.log(`AR scene ready for topic ${topicId}`);
      }).catch(error => {
        console.error(`Failed to create AR scene for topic ${topicId}:`, error);
      });
    }
    
    if (this.stateManager) {
      this.stateManager.changeState('ar_ready');
    }
  }

  // Start AR experience (called when user clicks "Start AR Experience")
  startARExperience() {
    if (this.currentTopic === null) {
      console.error('No topic selected for AR experience');
      return;
    }
    
    console.log(`🚀 Starting AR experience for topic ${this.currentTopic}`);
    
    // Transition to animating state
    if (this.stateManager) {
      this.stateManager.changeState('animating');
    }
    
    // Start loading process
    this.startARLoading();
  }

  // Start AR loading simulation
  startARLoading() {
    console.log(`📱 Starting AR loading for topic ${this.currentTopic}`);
    
    // Simulate loading process
    setTimeout(() => {
      this.completeARLoading();
    }, 3000);
  }

  // Complete AR loading and transition to video
  completeARLoading() {
    console.log(`📖 Loading content for topic ${this.currentTopic}`);
    
    // Update global currentTopic for the rest of the app
    if (typeof window !== 'undefined') {
      window.currentTopic = `topic_${this.currentTopic}`;
    }
    
    // Update UI
    this.updateDetectedPosterUI(this.currentTopic);
    
    // Transition to video state
    if (this.stateManager) {
      this.stateManager.changeState('video');
    }
    
    console.log(`✅ Topic ${this.currentTopic} content loaded successfully`);
  }

  // Handle scanning errors (real mode only)
  handleScanningError(error) {
    console.error('Scanning failed:', error);
    
    if (error.message.includes('camera') || error.message.includes('permission')) {
      this.showCameraError();
    } else {
      this.showGenericError();
    }
  }

  // Show camera permission error
  showCameraError() {
    console.log('Showing camera permission error');
    if (this.stateManager) {
      document.querySelector('.permission-section')?.classList.add('hidden');
      document.querySelector('.error-section')?.classList.remove('hidden');
    }
  }

  // Show generic error
  showGenericError() {
    console.log('Generic AR error occurred');
  }

  // Manual detection for testing (demo buttons)
  manualDetectPoster(posterId) {
    console.log(`🧪 Manual detection triggered: ${posterId}`);
    
    const targetIndex = this.posterMapping[posterId];
    if (targetIndex !== undefined) {
      this.handleTargetFound(targetIndex);
    }
  }

  // Connect to state manager
  connectStateManager(stateManager) {
    this.stateManager = stateManager;
    console.log('MindAR Manager connected to State Manager');
  }

  // Get current topic
  getCurrentTopic() {
    return this.currentTopic;
  }

  // Get current mode
  getCurrentMode() {
    return this.mode;
  }

  // Check if system is ready
  isReady() {
    return this.isInitialized;
  }

  // Reset for new scanning session
  reset() {
    this.currentTopic = null;
    this.stopScanning();
    console.log('MindAR Manager reset');
  }

  // Cleanup when done
  dispose() {
    this.stopScanning();
    
    // Remove AR container
    const container = document.getElementById('ar-container');
    if (container) {
      container.remove();
    }
    
    console.log('MindAR Manager disposed');
  }

  // Show AR not supported message
  showARNotSupported() {
    console.log('Showing AR not supported message');
    
    // Show the existing modal
    const messageContainer = document.getElementById('ar-not-supported-message');
    if (messageContainer) {
      messageContainer.classList.remove('hidden');
    }
    
    // Hide the scanning section
    const scanningSection = document.getElementById('scanning-section');
    if (scanningSection) {
      scanningSection.classList.add('hidden');
    }
  }

  // Utility: Simulate delay
  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Configuration options
const MINDAR_CONFIG = {
  // Mode: 'simulated', 'real', or 'auto' (auto tries real first, falls back to simulated)
  mode: 'auto',
  
  // Simulation settings (only used in simulated mode)
  simulationDelay: 3000, // ms
  defaultTarget: 0, // Default target for simulation (0-3)
  
  // Real mode settings
  targetsFile: './assets/targets/targets_4.mind',
  maxTrack: 4
};

// Create global instance with configuration
window.mindARManager = new MindARManager(MINDAR_CONFIG);

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MindARManager;
}

console.log(`Unified MindAR Manager loaded (mode: ${MINDAR_CONFIG.mode})`);

