// AR Scene Manager - Phase 4.5 Implementation
// Handles A-Frame scene creation, management, and disposal with asset caching

class ARSceneManager {
    constructor() {
        this.currentScene = null;
        this.isInitialized = false;
        this.assetCache = new Map(); // topicId -> cached assets
        this.stateManager = null;
        
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
                renderer="logarithmicDepthBuffer: true; colorManagement: true; physicallyCorrectLights: true"
                mindar-image="imageTargetSrc: ./assets/targets/targets_4.mind; maxTrack: 4; uiLoading: no; uiScanning: no; uiError: no"
                timeline-controller
                color-space="sRGB"
                device-orientation-permission-ui="enabled: false">
                
                <!-- Camera for AR tracking -->
                <a-camera 
                    id="ar-camera-${topicId}"
                    position="0 0 0"
                    look-controls="enabled: false"
                    wasd-controls="enabled: false"
                    cursor="rayOrigin: mouse">
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
                               opacity="0">
                        </a-box>
                        <a-sphere id="topic${topicId}-sphere" 
                                  position="1 0 0" 
                                  scale="0.5 0.5 0.5" 
                                  color="#264de4" 
                                  visible="false" 
                                  opacity="0">
                        </a-sphere>
                        <a-pyramid id="topic${topicId}-pyramid" 
                                   position="-1 0 0" 
                                   scale="0.5 0.5 0.5" 
                                   color="#f7df1e" 
                                   visible="false" 
                                   opacity="0">
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
            const targetIndex = event.detail.targetIndex;
            console.log(`🎯 Target detected in AR scene: ${targetIndex}`);
            this.handleTargetFound(targetIndex, topicId);
        });
        
        // Listen for target lost events
        this.currentScene.addEventListener('targetLost', (event) => {
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
        // Map target index to topic number (0-3 -> 1-4)
        const topicMapping = {
            0: 1, // Target 0 -> topic_1 (Web Development)
            1: 2, // Target 1 -> topic_2 (Digital Marketing)  
            2: 3, // Target 2 -> topic_3 (Data Science)
            3: 4  // Target 3 -> topic_4 (Cybersecurity)
        };
        
        const detectedTopicId = topicMapping[targetIndex];
        if (detectedTopicId && detectedTopicId === topicId) {
            console.log(`✅ Correct poster detected for topic ${topicId}`);
            
            // Start the animation timeline
            this.startAnimation(topicId);
            
            // Notify MindAR Manager about the detection
            if (window.mindARManager) {
                window.mindARManager.handleTargetFound(targetIndex);
            }
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
            // Stop any running animations
            const timelineController = this.currentScene.components['timeline-controller'];
            if (timelineController) {
                timelineController.reset();
            }
            
            const container = document.getElementById('ar-scene-container');
            if (container) {
                container.innerHTML = '';
            }
            
            // Show the camera placeholder again
            const placeholder = document.getElementById('camera-placeholder');
            if (placeholder) {
                placeholder.style.display = 'block';
            }
            
            this.currentScene = null;
            console.log('AR scene disposed (assets remain cached)');
        }
    }
    
    connectStateManager(stateManager) {
        this.stateManager = stateManager;
        
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
        
        console.log('AR Scene Manager connected to State Manager');
    }
    
    onStateEnter(state) {
        console.log(`AR Scene Manager: Entering state ${state}`);
        
        switch (state) {
            case 'scanning':
                // Scene will be created when poster is detected
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
}

// Create global instance
window.arSceneManager = new ARSceneManager();
console.log('AR Scene Manager loaded');
