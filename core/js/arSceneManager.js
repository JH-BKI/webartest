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
        
        // Add global error handler for MindAR errors
        this.setupGlobalErrorHandler();
        
        this.createSceneContainer();
        this.isInitialized = true;
        console.log('AR Scene Manager initialized successfully');
        return true;
    }
    
    // Set up global error handler for MindAR issues
    setupGlobalErrorHandler() {
        // Handle unhandled promise rejections (common with MindAR)
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('dummyRun')) {
                console.warn('⚠️ AR Scene Manager: MindAR dummyRun error caught globally - this is a known issue with MindAR 1.2.5');
                console.log('ℹ️ AR Scene Manager: AR functionality may still work despite this error');
                event.preventDefault(); // Prevent the error from showing in console
            }
        });
        
        // Handle general errors
        window.addEventListener('error', (event) => {
            if (event.message && event.message.includes('dummyRun')) {
                console.warn('⚠️ AR Scene Manager: MindAR dummyRun error caught globally');
                event.preventDefault();
            }
        });
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
        
        // Asset loading will be implemented when real assets are available
        // assets.models = [
        //     { id: `model_${topicId}_1`, url: `./assets/models/topic_${topicId}/model1.glb` }
        // ];
        
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
            // Load topic-specific animation file
            script.src = `./core/js/animations/timeline-topic-${topicId}.js?v=${Date.now()}`;
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
            
            // MindAR disposal is handled automatically by A-Frame when scene is removed
            
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
    
    // Simplified: No automatic state management connection
    // AR Scene Manager is now self-contained and responds to explicit method calls
    
    // Public API methods for explicit control
    startScanning() {
        console.log('🎬 AR Scene Manager: Starting AR scanning');
        this.injectARScene();
    }
    
    stopScanning() {
        console.log('⏹️ AR Scene Manager: Stopping AR scanning');
        this.disposeScene();
    }
    
    createSceneForTopic(topicId) {
        console.log(`🎯 AR Scene Manager: Creating scene for topic ${topicId}`);
        return this.createSceneForDetectedTopic(topicId);
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


    injectARScene() {
        const arSceneHTML = `   <a-scene id="AR-scene"  enabled="false"
    mindar-image="imageTargetSrc: ./assets/targets/targets_4.mind; 
                 filterMinCF: 0.0001; 
                 filterBeta: 0.001; 
                 warmupTolerance: 1; 
                 missTolerance: 1; 
                 maxTrack: 1;
                 autoStart: true;" 
    color-space="sRGB" 
    renderer="colorManagement: true, physicallyCorrectLights"
    vr-mode-ui="enabled: false" 
    device-orientation-permission-ui="enabled: false">  

    <!-- Hardcoded test assets commented out - will be loaded dynamically based on topic
    <a-assets>   
      <!-- Scene 01 Character Assets -->
      <img id="s01-scene-01-Alex" src="./assets/topic_1/s01-scene-01-Alex.png">
      <img id="s01-scene-01-Mia" src="./assets/topic_1/s01-scene-01-Mia.png">
      <img id="s01-speech-left" src="./assets/topic_1/s01-speech-left.png">
      <img id="s01-speech-right" src="./assets/topic_1/s01-speech-right.png">
      <img id="s01-floor" src="./assets/topic_1/s01-floor.png">
    </a-assets>
    -->

    <!-- Anime.js Timeline Container -->
    <div id="timelineContainer" style="display: none;"></div>
    
    <a-entity id="scenario-assets" position="0 0 -2" mindar-image-target="targetIndex: 0">
              <a-image id="s01-floor" src="#s01-floor" scale="2 1 2" position="0 -1 0" rotation="-90 0 0"></a-image>
    
    </a-entity>
    <a-entity id="scenario-assets" position="0 0 -2" mindar-image-target="targetIndex: 1">
              <a-image id="s01s01-Mia" src="#s01-scene-01-Mia" scale="2 4 1" position="0.75 0 -2.1" rotation="0 0 0" visible="true" opacity="1" material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal"></a-image>
    </a-entity>
    <a-entity id="scenario-assets" position="0 0 -2" mindar-image-target="targetIndex: 2">
              <a-image id="s01-speech-lt" src="#s01-speech-left" scale="1 1 1" position="-0.25 2.25 -2" rotation="0 0 0" visible="true" opacity="1" material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal"></a-image>
    </a-entity>
    <a-entity id="scenario-assets" position="0 0 -2" mindar-image-target="targetIndex: 3">
              <a-image id="s01-speech-rt" src="#s01-speech-right" scale="1 1 1" position="0.25 2.25 -2.1" rotation="0 0 0" visible="true" opacity="1" material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal"></a-image>
    </a-entity>

    <a-camera position="0 0 2" look-controls="enabled: false" cursor="rayOrigin: mouse"></a-camera>
</a-scene>`;

        document.body.insertAdjacentHTML('beforeend', arSceneHTML);
        console.log('AR Scene has been injected into the document body');



        const sceneEl = document.querySelector('a-scene');

        sceneEl.addEventListener("targetFound", (event) => {
          const targetEl = event.target; // the entity that fired the event
          const targetIndex = targetEl.getAttribute("mindar-image-target").targetIndex;
          console.log("Scene-level: found target index", targetIndex, "id:", targetEl.id);
        });
        
        sceneEl.addEventListener("targetLost", (event) => {
          const targetEl = event.target;
          const targetIndex = targetEl.getAttribute("mindar-image-target").targetIndex;
          console.log("Scene-level: lost target index", targetIndex, "id:", targetEl.id);
        });



        
        sceneEl.addEventListener("arReady", (event) => {
            console.log("MindAR is ready")
        });

        sceneEl.addEventListener("arError", (event) => {
            console.log("MindAR failed to start")
        });


    }

}

// Create global instance
window.arSceneManager = new ARSceneManager();
console.log('AR Scene Manager loaded');
