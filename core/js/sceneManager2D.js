// 2D Scene Manager - Non-AR version for browser-based experience
// Handles A-Frame scene creation and management in 2D mode with MindAR detection only

class SceneManager2D {
    constructor() {
        this.currentScene = null;
        this.isInitialized = false;
        this.assetCache = new Map(); // topicId -> cached assets
        this.currentTopic = null;
        this.isPaused = false;
        
        // Performance optimization caches
        this.elementCache = new Map();
        this.assetPreloadCache = new Map();
        
        // Topic mapping: target index -> topic number (same as AR version)
        this.topicMapping = {
            0: 1, // Target 0 -> topic_1
            1: 2, // Target 1 -> topic_2  
            2: 3, // Target 2 -> topic_3
            3: 4  // Target 3 -> topic_4
        };
        
        console.log('2D Scene Manager initialized');
    }
    
    /**
     * Initialize the 2D scene manager
     */
    async initialize() {
        if (typeof window.AFRAME === 'undefined') {
            console.error('A-Frame library not loaded');
            return false;
        }
        
        this.isInitialized = true;
        console.log('2D Scene Manager initialized successfully');
        return true;
    }
    
    /**
     * Create 2D scene with MindAR for detection only
     */
    async create2DScene() {
        if (!this.isInitialized) {
            console.error('2D Scene Manager not initialized');
            return false;
        }
        
        const container = document.getElementById('ar-scene-container');
        if (!container) return false;
        
        // Create A-Frame scene with MindAR for detection only (no AR camera)
        const sceneHTML = `
            <a-scene id="scene-2d"  
                mindar-image="imageTargetSrc: ./assets/targets/targets_4_final.mind; 
                filterMinCF: 0.0001; 
                filterBeta: 0.001; 
                warmupTolerance: 1; 
                missTolerance: 1; 
                maxTrack: 4;
                autoStart: true;" 
                timeline-controller
                color-space="sRGB" 
                renderer="colorManagement: true, physicallyCorrectLights, antialias: true, powerPreference: high-performance"
                xr-mode-ui="enabled: false" 
                loading-screen="enabled: false"
                device-orientation-permission-ui="enabled: false"
                stats="false"
                embedded="true">  

                <!-- OLD AR Camera -->
                <!-- <a-camera position="0 0 5" look-controls="enabled: false" cursor="rayOrigin: mouse" raycaster="objects: [data-raycastable]"></a-camera> -->
                <!-- MindAR Camera for detection (shows camera feed) -->
                <a-camera mindar-camera="cameraParam: auto; maxTrack: 4;" position="0 0 0" look-controls="enabled: false"></a-camera>
                
                <!-- Lighting for 2D content -->
                <a-light type="ambient" color="#404040" intensity="0.8"></a-light>
                <a-light type="directional" color="#ffffff" intensity="1.0" position="0 0 1"></a-light>
                
                <!-- Topic containers for detection only -->
                <a-entity id="detection-topic-1" position="0 0 0" mindar-image-target="targetIndex: 0" visible="false">
                    <!-- Topic 1 detection marker -->
                        <a-entity id="s01-loading" position="0 0 0">    
                            <a-image id="s01-loading-panel" src="./assets/topic_1/s01-image-marker.png" scale="1 1 1" position="0 0 0.25" rotation="0 0 0" 
                                material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal" geometry=""></a-image>   
                        </a-entity>
                </a-entity>
                <a-entity id="detection-topic-2" position="0 0 0" mindar-image-target="targetIndex: 1" visible="false">
                    <!-- Topic 2 detection marker -->
                    <a-entity id="s02-loading" position="0 0 0">    
                            <a-image id="s02-loading-panel" src="./assets/topic_2/s02-image-marker.png" scale="1 1 1" position="0 0 0.25" rotation="0 0 0" 
                                material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal" geometry=""></a-image>   
                        </a-entity>
                </a-entity>
                <a-entity id="detection-topic-3" position="0 0 0" mindar-image-target="targetIndex: 2" visible="false">
                    <!-- Topic 3 detection marker -->
                        <a-entity id="s03-loading" position="0 0 0">    
                            <a-image id="s03-loading-panel" src="./assets/topic_3/s03-image-marker.png" scale="1 1 1" position="0 0 0.25" rotation="0 0 0" 
                                material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal" geometry=""></a-image>   
                        </a-entity>
                </a-entity>
                <a-entity id="detection-topic-4" position="0 0 0" mindar-image-target="targetIndex: 3" visible="false">
                    <!-- Topic 4 detection marker -->
                        <a-entity id="s04-loading" position="0 0 0">    
                            <a-image id="s04-loading-panel" src="./assets/topic_4/s04-image-marker.png" scale="1 1 1" position="0 0 0.25" rotation="0 0 0" 
                                material="transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal" geometry=""></a-image>   
                        </a-entity>
                </a-entity>
                
                <!-- 2D Content Container - where animations will be displayed -->
                <a-entity id="2d-content-container" position="0 0 -2">
                    <!-- 2D content will be added here dynamically -->
                </a-entity>
                
            </a-scene>`;

        container.innerHTML = sceneHTML;
        this.currentScene = container.querySelector('#scene-2d');
        
        // Set up MindAR event listeners for detection only
        this.setupDetectionListeners();
        
        console.log('2D scene created with MindAR detection');
        return true;
    }
    
    /**
     * Set up MindAR listeners for detection only (no tracking)
     */
    setupDetectionListeners() {
        const sceneEl = document.querySelector('#scene-2d');
        if (!sceneEl) {
            console.error('❌ 2D Scene Manager: No 2D scene found for event listeners');
            return;
        }
        
        console.log('🎯 2D Scene Manager: Setting up MindAR detection listeners');
        
        // Listen for target found events (detection only)
        sceneEl.addEventListener('targetFound', (event) => {
            console.log('🎯 2D Detection: targetFound event received:', event);
            
            let targetIndex = null;
            
            // Extract targetIndex from event
            if (event.detail && event.detail.targetIndex !== undefined) {
                targetIndex = event.detail.targetIndex;
            } else {
                const targetEntity = event.target;
                if (targetEntity && targetEntity.getAttribute) {
                    const mindarTarget = targetEntity.getAttribute('mindar-image-target');
                    if (mindarTarget && mindarTarget.targetIndex !== undefined) {
                        targetIndex = mindarTarget.targetIndex;
                    }
                }
            }
            
            if (targetIndex === null) {
                console.warn('⚠️ 2D Detection: Could not extract targetIndex from event');
                return;
            }
            
            console.log(`🎯 2D Detection: Poster detected - targetIndex: ${targetIndex}`);
            this.handlePosterDetection(targetIndex);
        });
        
        // Listen for AR ready events
        sceneEl.addEventListener('arReady', (event) => {
            console.log('✅ 2D Scene Manager: MindAR detection ready');
        });
        
        // Listen for AR error events
        sceneEl.addEventListener('arError', (event) => {
            console.error('❌ 2D Scene Manager: MindAR detection failed');
        });
        
        console.log('🎯 2D Scene Manager: Detection listeners set up');
    }
    
    /**
     * Handle poster detection and set topic
     */
    handlePosterDetection(targetIndex) {
        const detectedTopicId = this.topicMapping[targetIndex];
        if (detectedTopicId) {
            console.log(`✅ 2D Detection: Poster detected for topic ${detectedTopicId}`);
            
            // Set global topic
            this.setGlobalTopic(detectedTopicId);
            
            // Update UI
            this.updateDetectedPosterUI(detectedTopicId);
            
            // STOP MindAR tracking - we only needed it for detection
            this.stopDetection();
            
            // Transition to AR Ready state (for countdown)
            if (window.stateManager) {
                console.log(`🔄 2D Scene Manager: Transitioning to ar_ready state`);
                window.stateManager.changeState('ar_ready');
            }
        } else {
            console.log(`⚠️ 2D Detection: Unknown target detected: ${targetIndex}`);
        }
    }
    
    /**
     * Start 2D animation for detected topic
     */
    start2DAnimation(topicId) {
        console.log(`🎬 2D Scene Manager: Starting 2D animation for topic ${topicId}`);
        
        // Convert existing detection scene to animation scene
        this.convertToAnimationScene(topicId);
        
        // Load topic-specific animation file
        this.loadTopicAnimation(topicId);
        
        // Set topic in timeline controller
        this.setTimelineTopic(topicId);
        
        // Start the animation
        setTimeout(() => {
            const sceneEl = document.querySelector('#AR-scene');
            if (sceneEl) {
                const timelineController = sceneEl.components['timeline-controller'];
                if (timelineController && timelineController.isTimelineReady()) {
                    console.log(`🎬 Starting 2D animation for topic ${topicId}`);
                    timelineController.startAnimeTimeline();
                } else {
                    console.log(`2D Timeline not ready for topic ${topicId}, retrying...`);
                    // Retry after a delay
                    setTimeout(() => {
                        if (timelineController && timelineController.isTimelineReady()) {
                            console.log(`🎬 Starting 2D animation for topic ${topicId} (retry)`);
                            timelineController.startAnimeTimeline();
                        }
                    }, 1000);
                }
            }
        }, 1000);
    }
    
    /**
     * Convert detection scene to animation scene
     */
    convertToAnimationScene(topicId) {
        console.log(`🔄 2D Scene Manager: Converting detection scene to animation scene for topic ${topicId}`);
        
        // Stop MindAR tracking
        this.stopDetection();
        
        // Change scene ID to AR-scene for timeline controller compatibility
        const sceneEl = document.querySelector('#scene-2d');
        console.log(`2D convertToAnimationScene: Looking for #scene-2d, found:`, sceneEl);
        if (sceneEl) {
            sceneEl.id = 'AR-scene';
            
            // Add timeline controller component
            sceneEl.setAttribute('timeline-controller', '');
            
            // Update camera for 2D viewing
            const camera = sceneEl.querySelector('a-camera');
            if (camera) {
                camera.setAttribute('position', '0 0 5');
                camera.setAttribute('look-controls', 'enabled: false');
                camera.setAttribute('cursor', 'rayOrigin: mouse');
                camera.setAttribute('raycaster', 'objects: [data-raycastable]');
                // Remove MindAR camera component
                camera.removeAttribute('mindar-camera');
            }
            
            // Add topic containers for timeline controller
            const topicContainer = document.createElement('a-entity');
            topicContainer.id = `scenario-assets-topic-${topicId}`;
            topicContainer.setAttribute('position', '0 0 -2');
            
            const topicGroup = document.createElement('a-entity');
            topicGroup.id = `scenario-assets-topic-group-${topicId}`;
            topicGroup.setAttribute('position', '0 0 0');
            
            topicContainer.appendChild(topicGroup);
            sceneEl.appendChild(topicContainer);
            
            // Add assets
            if (window.generateTopicAssetHTML) {
                const assetsHTML = window.generateTopicAssetHTML(topicId);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = assetsHTML;
                const assets = tempDiv.firstChild;
                if (assets) {
                    sceneEl.insertBefore(assets, sceneEl.firstChild);
                }
            }
            
            console.log(`2D animation scene converted for topic ${topicId} (AR-compatible structure)`);
            return true;
        } else {
            console.log(`2D convertToAnimationScene: #scene-2d not found, falling back to create2DAnimationScene`);
            return this.create2DAnimationScene(topicId);
        }
    }
    
    /**
     * Create 2D animation scene (no MindAR tracking)
     * Uses AR-compatible structure for timeline controller compatibility
     */
    create2DAnimationScene(topicId) {
        const container = document.getElementById('ar-scene-container');
        if (!container) return false;
        
        // Generate asset HTML for the detected topic (same as AR version)
        const assetHTML = this.generateTopicAssets(topicId);
        
        // Create 2D animation scene with AR-compatible structure
        const sceneHTML = `
            <a-scene id="AR-scene"  
                timeline-controller
                color-space="sRGB" 
                renderer="colorManagement: true, physicallyCorrectLights, antialias: true, powerPreference: high-performance"
                xr-mode-ui="enabled: false" 
                loading-screen="enabled: false"
                device-orientation-permission-ui="enabled: false"
                stats="false"
                embedded="true">  

                ${assetHTML}

                <!-- 2D Camera for browser viewing (positioned for 2D viewing) -->
                <a-camera position="0 0 5" look-controls="enabled: false" cursor="rayOrigin: mouse" raycaster="objects: [data-raycastable]"></a-camera>
                
                <!-- Lighting for 2D content -->
                <a-light type="ambient" color="#404040" intensity="0.8"></a-light>
                <a-light type="directional" color="#ffffff" intensity="1.0" position="0 0 1"></a-light>
                
                <!-- AR-compatible topic containers for timeline controller -->
                <a-entity id="scenario-assets-topic-${topicId}" position="0 0 -2">
                    <!-- Topic ${topicId} 2D content will be added here by timeline controller -->
                    <a-entity id="scenario-assets-topic-group-${topicId}" position="0 0 0">
                        <!-- Timeline controller will populate this with 2D positioned assets -->
                    </a-entity>
                </a-entity>
                
            </a-scene>`;

        container.innerHTML = sceneHTML;
        this.currentScene = container.querySelector('#AR-scene');
        
        console.log(`2D animation scene created for topic ${topicId} (AR-compatible structure)`);
        return true;
    }
    
    /**
     * Generate asset HTML for a specific topic (same as AR version)
     */
    generateTopicAssets(topicId) {
        if (window.generateTopicAssetHTML) {
            return window.generateTopicAssetHTML(topicId);
        }
        return '<a-assets></a-assets>';
    }
    
    /**
     * Load topic-specific animation file
     */
    async loadTopicAnimation(topicId) {
        try {
            const script = document.createElement('script');
            script.src = `./core/js/animations/timeline-topic-${topicId}.js?v=${Date.now()}`;
            script.onload = () => {
                console.log(`2D Animation file loaded for topic ${topicId}`);
                // Wait for timeline controller to initialize
                setTimeout(() => {
                    this.setTimelineTopic(topicId);
                }, 500);
            };
            script.onerror = () => {
                console.error(`Failed to load 2D animation file for topic ${topicId}`);
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error(`Error loading 2D animation file for topic ${topicId}:`, error);
        }
    }
    
    /**
     * Set the topic in the timeline controller
     */
    setTimelineTopic(topicId) {
        const sceneEl = document.querySelector('#AR-scene');
        console.log(`2D setTimelineTopic: Looking for #AR-scene, found:`, sceneEl);
        if (sceneEl) {
            const timelineController = sceneEl.components['timeline-controller'];
            console.log(`2D setTimelineTopic: Timeline controller found:`, timelineController);
            if (timelineController) {
                const zeroBasedTopicId = topicId - 1;
                console.log(`2D Timeline controller: Setting topic ${topicId} (0-based: ${zeroBasedTopicId})`);
                timelineController.setTopic(zeroBasedTopicId);
            } else {
                console.log(`2D setTimelineTopic: Timeline controller not found, retrying in 200ms...`);
                setTimeout(() => {
                    this.setTimelineTopic(topicId);
                }, 200);
            }
        } else {
            console.log(`2D setTimelineTopic: #AR-scene not found in document`);
        }
    }
    
    /**
     * Update UI when poster is detected
     */
    updateDetectedPosterUI(topicId) {
        const topicTitle = window.getTopicTitle ? window.getTopicTitle(topicId) : `Topic ${topicId}`;
        
        const titleElement = document.getElementById('detected-poster-title');
        if (titleElement) {
            titleElement.textContent = `Topic ${topicId}: ${topicTitle}`;
        }
        
        console.log(`🎨 2D UI updated for topic: ${topicTitle}`);
    }
    
    /**
     * Set global topic
     */
    setGlobalTopic(topicId) {
        if (typeof setCurrentTopic === 'function') {
            setCurrentTopic(`topic_${topicId}`);
        }
        
        if (typeof window !== 'undefined') {
            window.currentTopic = `topic_${topicId}`;
        }
        
        this.currentTopic = topicId;
        console.log(`📚 2D Topic set globally: ${topicId} (topic_${topicId})`);
    }
    
    /**
     * Get current topic
     */
    getCurrentTopic() {
        return this.currentTopic;
    }
    
    /**
     * Start detection process
     */
    startDetection() {
        console.log('🎬 2D Scene Manager: Starting poster detection');
        
        // Create 2D scene with MindAR detection
        this.create2DScene();
        
        // Start MindAR for detection only
        setTimeout(() => {
            this.startMindARDetection();
        }, 200);
    }
    
    /**
     * Start MindAR for detection only
     */
    startMindARDetection() {
        const sceneEl = document.querySelector('#scene-2d');
        if (sceneEl) {
            const mindarSystem = sceneEl.systems['mindar-image-system'];
            if (mindarSystem) {
                try {
                    console.log('📹 Starting MindAR detection (no AR camera)');
                    mindarSystem.start();
                } catch (error) {
                    console.warn('⚠️ MindAR detection start failed:', error.message);
                }
            } else {
                console.warn('⚠️ MindAR system not found for detection');
            }
        }
    }
    
    /**
     * Stop detection
     */
    stopDetection() {
        console.log('⏹️ 2D Scene Manager: Stopping detection');
        const sceneEl = document.querySelector('#scene-2d');
        if (sceneEl) {
            const mindarSystem = sceneEl.systems['mindar-image-system'];
            if (mindarSystem) {
                try {
                    mindarSystem.stop();
                } catch (error) {
                    console.warn('⚠️ Error stopping MindAR detection:', error);
                }
            }
        }
    }
    
    /**
     * Check if system is ready
     */
    isReady() {
        return this.isInitialized;
    }
    
    /**
     * Reset for new session
     */
    reset() {
        this.currentTopic = null;
        console.log('2D Scene Manager reset');
    }
}

// Create global instance
window.sceneManager2D = new SceneManager2D();
console.log('2D Scene Manager v2.28 loaded - ready for 2D mode');

console.log('2D Scene Manager loaded');
