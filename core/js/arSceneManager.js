// AR Scene Manager - Phase 4.5 Implementation
// Handles A-Frame scene creation, management, and disposal with asset caching

class ARSceneManager {
    constructor() {
        this.currentScene = null;
        this.isInitialized = false;
        this.assetCache = new Map(); // topicId -> cached assets
        this.stateManager = null;
        this.currentTopic = null;
        
        // Topic mapping: target index -> topic number
        this.topicMapping = {
            0: 1, // Target 0 -> topic_1 (Web Development)
            1: 2, // Target 1 -> topic_2 (Digital Marketing)  
            2: 3, // Target 2 -> topic_3 (Data Science)
            3: 4  // Target 3 -> topic_4 (Cybersecurity)
        };
        
        console.log('AR Scene Manager initialized');
    }
    
    async initialize() {
        if (typeof window.AFRAME === 'undefined') {
            console.error('A-Frame library not loaded');
            return false;
        }
        
        this.createSceneContainer();
        this.isInitialized = true;
        console.log('AR Scene Manager initialized successfully');
        return true;
    }
    
    createSceneContainer() {
        let container = document.getElementById('ar-scene-container');
        if (!container) {
            console.error('AR scene container not found in HTML');
            return null;
        }
        
        // Hide the placeholder and prepare for AR scene
        const placeholder = document.getElementById('camera-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
            console.log('📷 AR Scene Manager: Camera placeholder hidden');
        } else {
            console.warn('⚠️ AR Scene Manager: Camera placeholder not found');
        }
        
        return container;
    }
    
    async createScene(topicId) {
        if (!this.isInitialized) {
            console.error('AR Scene Manager not initialized');
            return false;
        }
        
        this.disposeScene();
        
        // Check cache first
        const cachedAssets = this.assetCache.get(topicId);
        if (cachedAssets) {
            console.log(`Using cached assets for topic ${topicId}`);
            return this.buildSceneFromCache(topicId, cachedAssets);
        }
        
        // Download and cache assets
        const assets = await this.downloadAndCacheAssets(topicId);
        return this.buildSceneFromCache(topicId, assets);
    }
    
    async downloadAndCacheAssets(topicId) {
        const assets = {
            models: [],
            textures: [],
            timestamp: Date.now()
        };
        
        // Placeholder assets - replace with actual URLs
        assets.models = [
            { id: `model_${topicId}_1`, url: `./assets/models/topic_${topicId}/model1.glb` }
        ];
        
        this.assetCache.set(topicId, assets);
        console.log(`Assets cached for topic ${topicId}`);
        return assets;
    }
    
    buildSceneFromCache(topicId, assets) {
        const container = document.getElementById('ar-scene-container');
        if (!container) return false;
        
        // Create A-Frame scene with MindAR for real camera feed and timeline controller
        const sceneHTML = `
            <a-scene 
                id="ar-scene-${topicId}"
                background="transparent"
                embedded
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; colorManagement: true"
                mindar-image="imageTargetSrc: ./assets/targets/targets_4.mind; maxTrack: 4; uiLoading: yes; uiScanning: yes; uiError: yes; autoStart: true"
                timeline-controller
                color-space="sRGB"
                device-orientation-permission-ui="enabled: false">
                
                <!-- Camera for AR tracking -->
                <a-camera 
                    id="ar-camera-${topicId}"
                    position="0 0 0"
                    look-controls="enabled: false"
                    wasd-controls="enabled: false"
                    cursor="rayOrigin: mouse"
                    raycaster="objects: [data-raycastable]">
                </a-camera>
                
                <!-- Lighting for 3D content -->
                <a-light 
                    type="ambient" 
                    color="#404040" 
                    intensity="0.6">
                </a-light>
                <a-light 
                    type="directional" 
                    color="#ffffff" 
                    intensity="0.8"
                    position="1 1 1">
                </a-light>
                
                <!-- Topic-specific content containers for each target -->
                <a-entity id="topic-${topicId}-assets" position="0 0 -2" mindar-image-target="targetIndex: ${topicId - 1}">
                    <!-- Topic ${topicId} 3D content will be added here -->
                    <a-entity id="topic-${topicId}-content">
                        <!-- Basic 3D content for testing - will be enhanced by animation system -->
                        <a-box id="topic${topicId}-cube" 
                               position="0 0 0" 
                               scale="0.5 0.5 0.5" 
                               color="#e34c26" 
                               visible="false" 
                               opacity="0"
                               data-raycastable>
                        </a-box>
                        <a-sphere id="topic${topicId}-sphere" 
                                  position="1 0 0" 
                                  scale="0.5 0.5 0.5" 
                                  color="#264de4" 
                                  visible="false" 
                                  opacity="0"
                                  data-raycastable>
                        </a-sphere>
                        <a-pyramid id="topic${topicId}-pyramid" 
                                   position="-1 0 0" 
                                   scale="0.5 0.5 0.5" 
                                   color="#f7df1e" 
                                   visible="false" 
                                   opacity="0"
                                   data-raycastable>
                        </a-pyramid>
                    </a-entity>
                </a-entity>
                
            </a-scene>
        `;
        
        container.innerHTML = sceneHTML;
        this.currentScene = container.querySelector(`#ar-scene-${topicId}`);
        
        // Set up MindAR event listeners for this scene
        this.setupMindARListeners(topicId);
        
        // Load topic-specific animation file
        this.loadTopicAnimation(topicId);
        
        console.log(`AR scene created for topic ${topicId} with timeline controller`);
        return true;
    }
    
    // Set up MindAR event listeners for target detection
    setupMindARListeners(topicId) {
        if (!this.currentScene) return;
        
        // Listen for target found events
        this.currentScene.addEventListener('targetFound', (event) => {
            if (!event.detail) {
                console.warn('⚠️ AR Scene Manager: targetFound event has no detail');
                return;
            }
            const targetIndex = event.detail.targetIndex;
            console.log(`🎯 Target detected in AR scene: ${targetIndex}`);
            this.handleTargetFound(targetIndex, topicId);
        });
        
        // Listen for target lost events
        this.currentScene.addEventListener('targetLost', (event) => {
            if (!event.detail) {
                console.warn('⚠️ AR Scene Manager: targetLost event has no detail');
                return;
            }
            const targetIndex = event.detail.targetIndex;
            console.log(`📤 Target lost in AR scene: ${targetIndex}`);
            this.handleTargetLost(targetIndex, topicId);
        });
        
        console.log(`MindAR listeners set up for topic ${topicId}`);
    }
    
    // Load topic-specific animation file
    async loadTopicAnimation(topicId) {
        try {
            // Load the animation file dynamically
            const script = document.createElement('script');
            // Use test animation file for now
            script.src = `./core/js/animations/timeline-topic-${topicId}-test.js?v=${Date.now()}`;
            script.onload = () => {
                console.log(`Animation file loaded for topic ${topicId}`);
                // Set the topic in the timeline controller
                this.setTimelineTopic(topicId);
            };
            script.onerror = () => {
                console.error(`Failed to load animation file for topic ${topicId}`);
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error(`Error loading animation file for topic ${topicId}:`, error);
        }
    }
    
    // Set the topic in the timeline controller
    setTimelineTopic(topicId) {
        if (this.currentScene) {
            const timelineController = this.currentScene.components['timeline-controller'];
            if (timelineController) {
                timelineController.setTopic(topicId - 1); // Convert to 0-based index
                console.log(`Timeline controller set to topic ${topicId}`);
            }
        }
    }
    
    // Handle target found event
    handleTargetFound(targetIndex, topicId) {
        const detectedTopicId = this.topicMapping[targetIndex];
        if (detectedTopicId && detectedTopicId === topicId) {
            console.log(`✅ Correct poster detected for topic ${topicId}`);
            
            // Start the animation timeline
            this.startAnimation(topicId);
            
            // Update global topic
            this.setGlobalTopic(detectedTopicId);
            
            // Update UI
            this.updateDetectedPosterUI(detectedTopicId);
        } else {
            console.log(`⚠️ Wrong poster detected. Expected topic ${topicId}, got target ${targetIndex}`);
        }
    }
    
    // Start animation for the detected topic
    startAnimation(topicId) {
        if (this.currentScene) {
            const timelineController = this.currentScene.components['timeline-controller'];
            if (timelineController && timelineController.isTimelineReady()) {
                console.log(`Starting animation for topic ${topicId}`);
                timelineController.startAnimeTimeline();
            } else {
                console.log(`Timeline not ready for topic ${topicId}`);
            }
        }
    }
    
    // Handle target lost event
    handleTargetLost(targetIndex, topicId) {
        console.log(`Target ${targetIndex} lost for topic ${topicId}`);
        
        // Pause the animation when target is lost
        if (this.currentScene) {
            const timelineController = this.currentScene.components['timeline-controller'];
            if (timelineController) {
                console.log(`Pausing animation for topic ${topicId}`);
                timelineController.quickPause();
            }
        }
    }
    
    disposeScene() {
        if (this.currentScene) {
            console.log('🧹 AR Scene Manager: Disposing current scene...');
            
            // Stop any running animations
            const timelineController = this.currentScene.components['timeline-controller'];
            if (timelineController) {
                console.log('⏹️ AR Scene Manager: Stopping timeline controller');
                timelineController.reset();
            }
            
            // Safely dispose MindAR components
            try {
                const mindarSystem = this.currentScene.systems['mindar-image-system'];
                if (mindarSystem && mindarSystem.stop) {
                    console.log('⏹️ AR Scene Manager: Stopping MindAR system');
                    mindarSystem.stop();
                }
            } catch (error) {
                console.warn('⚠️ AR Scene Manager: Error stopping MindAR system:', error);
                // Continue with disposal even if MindAR stop fails
            }
            
            const container = document.getElementById('ar-scene-container');
            if (container) {
                console.log('🗑️ AR Scene Manager: Clearing container HTML');
                container.innerHTML = '';
            }
            
            // Show the camera placeholder again
            const placeholder = document.getElementById('camera-placeholder');
            if (placeholder) {
                placeholder.style.display = 'block';
            }
            
            this.currentScene = null;
            console.log('✅ AR Scene Manager: Scene disposed (assets remain cached)');
        }
    }
    
    connectStateManager(stateManager) {
        this.stateManager = stateManager;
        
        // Prevent duplicate connections
        if (this.stateManagerConnected) {
            console.log('AR Scene Manager already connected to State Manager');
            return;
        }
        
        // Add state transition listeners
        const originalChangeState = stateManager.changeState.bind(stateManager);
        stateManager.changeState = (newState) => {
            // Handle state exit
            this.onStateExit(stateManager.getCurrentState());
            
            // Call original changeState
            const result = originalChangeState(newState);
            
            // Handle state enter
            this.onStateEnter(newState);
            
            return result;
        };
        
        this.stateManagerConnected = true;
        console.log('AR Scene Manager connected to State Manager');
    }
    
    onStateEnter(state) {
        console.log(`AR Scene Manager: Entering state ${state}`);
        
        // Prevent duplicate state transitions
        if (this.currentState === state) {
            console.log(`AR Scene Manager: Already in state ${state}, skipping`);
            return;
        }
        
        this.currentState = state;
        
        switch (state) {
            case 'scanning':
                // Create a basic AR scene for camera feed immediately
                this.createBasicARScene();
                break;
            case 'ar_ready':
                // Scene should be ready
                break;
            case 'animating':
                // Scene should be active
                break;
            default:
                // Hide scene for other states
                this.disposeScene();
                break;
        }
    }
    
    onStateExit(state) {
        console.log(`AR Scene Manager: Exiting state ${state}`);
        
        switch (state) {
            case 'scanning':
            case 'ar_ready':
            case 'animating':
                // Keep scene active
                break;
            default:
                // Dispose scene when leaving AR states
                this.disposeScene();
                break;
        }
    }
    
    // Create basic AR scene for camera feed (called when entering scanning state)
    createBasicARScene() {
        console.log('🎬 AR Scene Manager: Creating basic AR scene for camera feed');
        
        if (!this.isInitialized) {
            console.error('❌ AR Scene Manager not initialized');
            return false;
        }
        
        console.log('🧹 AR Scene Manager: Disposing any existing scene');
        this.disposeScene();
        
        const container = document.getElementById('ar-scene-container');
        if (!container) {
            console.error('❌ AR scene container not found in DOM');
            return false;
        }
        
        console.log('✅ AR Scene Manager: Container found, creating A-Frame scene');
        
        // Create basic A-Frame scene with MindAR for camera feed
        const sceneHTML = `
            <a-scene 
                id="ar-scene-basic"
                background="transparent"
                embedded
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; colorManagement: true"
                mindar-image="imageTargetSrc: ./assets/targets/targets_4.mind; maxTrack: 4; uiLoading: yes; uiScanning: yes; uiError: yes; autoStart: true"
                color-space="sRGB"
                device-orientation-permission-ui="enabled: false">
                
                <!-- Camera for AR tracking -->
                <a-camera 
                    id="ar-camera-basic"
                    position="0 0 0"
                    look-controls="enabled: false"
                    wasd-controls="enabled: false"
                    cursor="rayOrigin: mouse"
                    raycaster="objects: [data-raycastable]">
                </a-camera>
                
                <!-- Basic lighting -->
                <a-light 
                    type="ambient" 
                    color="#404040" 
                    intensity="0.6">
                </a-light>
                <a-light 
                    type="directional" 
                    color="#ffffff" 
                    intensity="0.8"
                    position="1 1 1">
                </a-light>
                
            </a-scene>
        `;
        
        console.log('📝 AR Scene Manager: Injecting A-Frame scene HTML into container');
        container.innerHTML = sceneHTML;
        
        console.log('🔍 AR Scene Manager: Looking for A-Frame scene element');
        this.currentScene = container.querySelector('#ar-scene-basic');
        
        if (!this.currentScene) {
            console.error('❌ AR Scene Manager: Failed to find A-Frame scene element');
            return false;
        }
        
        console.log('✅ AR Scene Manager: A-Frame scene element found');
        
        // Set up MindAR event listeners for basic scene
        console.log('🎧 AR Scene Manager: Setting up MindAR event listeners');
        this.setupBasicMindARListeners();
        
        console.log('🎉 AR Scene Manager: Basic AR scene created successfully for camera feed');
        return true;
    }
    
    // Set up basic MindAR event listeners for camera feed
    setupBasicMindARListeners() {
        if (!this.currentScene) {
            console.error('❌ AR Scene Manager: No current scene for MindAR listeners');
            return;
        }
        
        console.log('🎧 AR Scene Manager: Adding targetFound event listener');
        // Listen for target found events
        this.currentScene.addEventListener('targetFound', (event) => {
            if (!event.detail) {
                console.warn('⚠️ AR Scene Manager: targetFound event has no detail');
                return;
            }
            const targetIndex = event.detail.targetIndex;
            console.log(`🎯 AR Scene Manager: Target detected - Index: ${targetIndex}`, event.detail);
            this.handleBasicTargetFound(targetIndex);
        });
        
        console.log('🎧 AR Scene Manager: Adding targetLost event listener');
        // Listen for target lost events
        this.currentScene.addEventListener('targetLost', (event) => {
            if (!event.detail) {
                console.warn('⚠️ AR Scene Manager: targetLost event has no detail');
                return;
            }
            const targetIndex = event.detail.targetIndex;
            console.log(`📤 AR Scene Manager: Target lost - Index: ${targetIndex}`, event.detail);
            this.handleBasicTargetLost(targetIndex);
        });
        
        // Add MindAR system status listeners
        this.currentScene.addEventListener('mindarReady', (event) => {
            console.log('✅ AR Scene Manager: MindAR system ready for scanning', event.detail);
        });
        
        this.currentScene.addEventListener('mindarError', (event) => {
            console.error('❌ AR Scene Manager: MindAR system error', event.detail);
        });
        
        this.currentScene.addEventListener('mindarLoaded', (event) => {
            console.log('✅ AR Scene Manager: MindAR targets loaded successfully', event.detail);
        });
        
        this.currentScene.addEventListener('mindarLoadError', (event) => {
            console.error('❌ AR Scene Manager: MindAR target loading error', event.detail);
        });
        
        // Check if MindAR system is available
        setTimeout(() => {
            const mindarSystem = this.currentScene.systems['mindar-image-system'];
            if (mindarSystem) {
                console.log('✅ AR Scene Manager: MindAR system found and active');
                console.log('📊 AR Scene Manager: MindAR system status:', mindarSystem);
                
                // Check target detection status
                if (mindarSystem.isScanning) {
                    console.log('🔍 AR Scene Manager: MindAR is actively scanning for targets');
                } else {
                    console.warn('⚠️ AR Scene Manager: MindAR is not scanning for targets');
                    console.log('🔄 AR Scene Manager: Attempting to start MindAR scanning...');
                    try {
                        if (mindarSystem.start) {
                            mindarSystem.start();
                            console.log('✅ AR Scene Manager: MindAR scanning started');
                        } else {
                            console.warn('⚠️ AR Scene Manager: MindAR start method not available');
                        }
                    } catch (error) {
                        console.error('❌ AR Scene Manager: Error starting MindAR scanning:', error);
                    }
                }
                
                // Check if targets are loaded
                if (mindarSystem.imageTargets && mindarSystem.imageTargets.length > 0) {
                    console.log(`📋 AR Scene Manager: ${mindarSystem.imageTargets.length} image targets loaded`);
                } else {
                    console.log('⏳ AR Scene Manager: Targets still loading... (this is normal)');
                }
                
                // Check camera feed
                const camera = this.currentScene.querySelector('a-camera');
                if (camera) {
                    console.log('📷 AR Scene Manager: Camera element found');
                    const video = camera.querySelector('video');
                    if (video) {
                        console.log('📹 AR Scene Manager: Video element found, dimensions:', video.videoWidth, 'x', video.videoHeight);
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            console.log('✅ AR Scene Manager: Camera feed is active');
                        } else {
                            console.warn('⚠️ AR Scene Manager: Camera feed not active (0x0 dimensions)');
                        }
                    } else {
                        console.warn('⚠️ AR Scene Manager: Video element not found in camera');
                        console.log('ℹ️ AR Scene Manager: Camera feed may still be initializing...');
                    }
                } else {
                    console.warn('⚠️ AR Scene Manager: Camera element not found');
                }
            } else {
                console.warn('⚠️ AR Scene Manager: MindAR system not found');
            }
        }, 1000);
        
        console.log('✅ AR Scene Manager: Basic MindAR listeners set up for camera feed');
        
        // Simple periodic status check
        setInterval(() => {
            if (this.currentScene) {
                const mindarSystem = this.currentScene.systems['mindar-image-system'];
                if (mindarSystem && mindarSystem.isScanning) {
                    console.log('🔍 AR Scene Manager: Still scanning for targets...');
                }
            }
        }, 10000); // Check every 10 seconds
        
        // Add test button for manual target detection (for debugging)
        setTimeout(() => {
            const testButton = document.createElement('button');
            testButton.textContent = 'Test Target Detection';
            testButton.style.position = 'fixed';
            testButton.style.top = '100px';
            testButton.style.right = '10px';
            testButton.style.zIndex = '40000';
            testButton.style.padding = '10px';
            testButton.style.backgroundColor = '#007bff';
            testButton.style.color = 'white';
            testButton.style.border = 'none';
            testButton.style.borderRadius = '5px';
            testButton.onclick = () => {
                console.log('🧪 AR Scene Manager: Manual target detection test');
                this.handleBasicTargetFound(0); // Simulate target 0 detection
            };
            document.body.appendChild(testButton);
            console.log('🧪 AR Scene Manager: Test button added for manual target detection');
            
            // Simulated mode indicator removed - using real AR only
        }, 2000);
    }
    
    // Handle target found in basic scene
    handleBasicTargetFound(targetIndex) {
        console.log(`🔍 AR Scene Manager: Processing target found - Index: ${targetIndex}`);
        
        const detectedTopicId = this.topicMapping[targetIndex];
        console.log(`🗺️ AR Scene Manager: Target ${targetIndex} maps to Topic ${detectedTopicId}`);
        
        if (detectedTopicId) {
            console.log(`✅ AR Scene Manager: Poster detected for topic ${detectedTopicId}`);
            
            // Set global topic
            this.setGlobalTopic(detectedTopicId);
            
            // Update UI
            this.updateDetectedPosterUI(detectedTopicId);
            
            // Create topic-specific scene
            this.createSceneForDetectedTopic(detectedTopicId);
            
            // Trigger state transition
            if (this.stateManager) {
                console.log(`🔄 AR Scene Manager: Transitioning to ar_ready state for topic ${detectedTopicId}`);
                this.stateManager.changeState('ar_ready');
            }
        } else {
            console.error(`❌ AR Scene Manager: Invalid target index ${targetIndex}`);
        }
    }
    
    // Handle target lost in basic scene
    handleBasicTargetLost(targetIndex) {
        console.log(`Target ${targetIndex} lost - keeping basic scene active`);
    }
    
    // Create scene when poster is detected (called by MindAR Manager)
    async createSceneForDetectedTopic(topicId) {
        console.log(`Creating AR scene for detected topic: ${topicId}`);
        
        if (!this.isInitialized) {
            console.error('AR Scene Manager not initialized');
            return false;
        }
        
        try {
            const success = await this.createScene(topicId);
            if (success) {
                console.log(`AR scene created successfully for topic ${topicId}`);
                return true;
            } else {
                console.error(`Failed to create AR scene for topic ${topicId}`);
                return false;
            }
        } catch (error) {
            console.error(`Error creating AR scene for topic ${topicId}:`, error);
            return false;
        }
    }
    
    getCacheStatus() {
        return {
            cachedTopics: Array.from(this.assetCache.keys()),
            cacheSize: this.assetCache.size
        };
    }
    
    // Update UI when poster is detected
    updateDetectedPosterUI(topicId) {
        const topicTitle = window.getTopicTitle ? window.getTopicTitle(topicId) : `Topic ${topicId}`;
        
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
    
    // Set global topic
    setGlobalTopic(topicId) {
        if (typeof setCurrentTopic === 'function') {
            setCurrentTopic(`topic_${topicId}`);
        }
        
        if (typeof window !== 'undefined') {
            window.currentTopic = `topic_${topicId}`;
        }
        
        this.currentTopic = topicId;
        console.log(`📚 Topic set globally: ${topicId} (topic_${topicId})`);
    }
    
    // Get current topic
    getCurrentTopic() {
        return this.currentTopic;
    }
    
    // Reset for new scanning session
    reset() {
        this.currentTopic = null;
        this.disposeScene();
        console.log('AR Scene Manager reset');
    }
    
    // Check if system is ready
    isReady() {
        return this.isInitialized;
    }
}

// Create global instance
window.arSceneManager = new ARSceneManager();
console.log('AR Scene Manager loaded');
