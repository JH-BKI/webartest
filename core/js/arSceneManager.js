// AR Scene Manager - Phase 4.5 Implementation
// Handles A-Frame scene creation, management, and disposal with asset caching

class ARSceneManager {
    constructor() {
        this.currentScene = null;
        this.isInitialized = false;
        this.assetCache = new Map(); // topicId -> cached assets
        this.stateManager = null;
        this.currentTopic = null;
        this.tipInterval = null;
        this.tipIndex = 0;
        
        // Topic mapping: target index -> topic number
        this.topicMapping = {
            0: 1, // Target 0 -> topic_1 (Web Development)
            1: 2, // Target 1 -> topic_2 (Digital Marketing)  
            2: 3, // Target 2 -> topic_3 (Data Science)
            3: 4  // Target 3 -> topic_4 (Cybersecurity)
        };
        
        // Tips for AR scanning
        this.tips = [
            "💡 <strong>Tip:</strong> Keep your device steady and follow the on-screen instructions",
            "💡 <strong>Tip:</strong> Make sure your camera lens is clean for best results",
            "💡 <strong>Tip:</strong> Good lighting helps the camera detect posters faster",
            "💡 <strong>Tip:</strong> Move closer if the poster is not detected",
            "💡 <strong>Tip:</strong> Try different angles if scanning is slow"
        ];
        
        console.log('AR Scene Manager initialized');
    }
    
    async initialize() {
        if (typeof window.AFRAME === 'undefined') {
            console.error('A-Frame library not loaded');
            return false;
        }
        
        // Add global error handler for MindAR errors
        this.setupGlobalErrorHandler();
        
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
    setupMindARListeners() {
        const sceneEl = document.querySelector('a-scene');
        if (!sceneEl) {
            console.error('❌ AR Scene Manager: No AR scene found for event listeners');
            return;
        }
        
        // Listen for target found events
        sceneEl.addEventListener('targetFound', (event) => {
            console.log('🎯 targetFound event received:', event);
            console.log('🎯 Event detail:', event.detail);
            console.log('🎯 Event target:', event.target);
            
            let targetIndex = null;
            
            // Try to get targetIndex from event detail first
            if (event.detail && event.detail.targetIndex !== undefined) {
                targetIndex = event.detail.targetIndex;
                console.log(`🎯 Target index from detail: ${targetIndex}`);
            } else {
                // Fallback: extract targetIndex from the target entity's mindar-image-target attribute
                const targetEntity = event.target;
                if (targetEntity && targetEntity.getAttribute) {
                    const mindarTarget = targetEntity.getAttribute('mindar-image-target');
                    if (mindarTarget && mindarTarget.targetIndex !== undefined) {
                        targetIndex = mindarTarget.targetIndex;
                        console.log(`🎯 Target index from entity attribute: ${targetIndex}`);
                    }
                }
            }
            
            if (targetIndex === null) {
                console.warn('⚠️ AR Scene Manager: Could not extract targetIndex from event');
                return;
            }
            
            console.log(`🎯 Target detected in AR scene: ${targetIndex}`);
            this.handleTargetFound(targetIndex);
        });
        
        // Listen for target lost events
        sceneEl.addEventListener('targetLost', (event) => {
            console.log('📤 targetLost event received:', event);
            
            let targetIndex = null;
            
            // Try to get targetIndex from event detail first
            if (event.detail && event.detail.targetIndex !== undefined) {
                targetIndex = event.detail.targetIndex;
                console.log(`📤 Target index from detail: ${targetIndex}`);
            } else {
                // Fallback: extract targetIndex from the target entity's mindar-image-target attribute
                const targetEntity = event.target;
                if (targetEntity && targetEntity.getAttribute) {
                    const mindarTarget = targetEntity.getAttribute('mindar-image-target');
                    if (mindarTarget && mindarTarget.targetIndex !== undefined) {
                        targetIndex = mindarTarget.targetIndex;
                        console.log(`📤 Target index from entity attribute: ${targetIndex}`);
                    }
                }
            }
            
            if (targetIndex === null) {
                console.warn('⚠️ AR Scene Manager: Could not extract targetIndex from targetLost event');
                return;
            }
            
            console.log(`📤 Target lost in AR scene: ${targetIndex}`);
            this.handleTargetLost(targetIndex);
        });
        
        // Listen for AR ready events
        sceneEl.addEventListener('arReady', (event) => {
            console.log('✅ AR Scene Manager: MindAR is ready');
        });
        
        // Listen for AR error events
        sceneEl.addEventListener('arError', (event) => {
            console.error('❌ AR Scene Manager: MindAR failed to start');
        });
        
        console.log('🎯 AR Scene Manager: MindAR event listeners set up');
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
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            const timelineController = sceneEl.components['timeline-controller'];
            if (timelineController) {
                timelineController.setTopic(topicId - 1); // Convert to 0-based index
                console.log(`Timeline controller set to topic ${topicId}`);
            }
        }
    }
    
    // Handle target found event
    handleTargetFound(targetIndex) {
        console.log(`🎯 handleTargetFound called with targetIndex: ${targetIndex}`);
        console.log(`🎯 Topic mapping:`, this.topicMapping);
        
        const detectedTopicId = this.topicMapping[targetIndex];
        if (detectedTopicId) {
            console.log(`✅ Poster detected for topic ${detectedTopicId}`);
            
            // Update global topic
            this.setGlobalTopic(detectedTopicId);
            
            // Add entities to the detected topic container
            this.addEntitiesToTopic(detectedTopicId);
            
            // Set topic in timeline controller
            this.setTimelineTopic(detectedTopicId);
            
            // Update UI
            this.updateDetectedPosterUI(detectedTopicId);
                     
            
            // Transition to ar_ready state
            if (window.stateManager) {
                console.log(`🔄 AR Scene Manager: Transitioning to ar_ready state`);
                window.stateManager.changeState('ar_ready');
                
                // Debug: Check if ar-ready-section is visible
                setTimeout(() => {
                    const arReadySection = document.getElementById('ar-ready-section');
                    if (arReadySection) {
                        console.log('🔍 AR Ready Section found:', arReadySection);
                        console.log('🔍 AR Ready Section classes:', arReadySection.className);
                        console.log('🔍 AR Ready Section hidden?', arReadySection.classList.contains('hidden'));
                        
                        // Check all child elements
                        const appTip = document.getElementById('app-tip');
                        const detectionSuccess = arReadySection.querySelector('.detection-success');
                        const arInstructions = arReadySection.querySelector('.ar-instructions');
                        const startButton = arReadySection.querySelector('button');
                        
                        console.log('🔍 App Tip:', appTip, appTip ? appTip.offsetHeight : 'not found');
                        console.log('🔍 Detection Success:', detectionSuccess, detectionSuccess ? detectionSuccess.offsetHeight : 'not found');
                        console.log('🔍 AR Instructions:', arInstructions, arInstructions ? arInstructions.offsetHeight : 'not found');
                        console.log('🔍 Start Button:', startButton, startButton ? startButton.offsetHeight : 'not found');
                        
                        // Check computed styles
                        if (startButton) {
                            const computedStyle = window.getComputedStyle(startButton);
                            console.log('🔍 Button computed styles:', {
                                display: computedStyle.display,
                                visibility: computedStyle.visibility,
                                opacity: computedStyle.opacity,
                                position: computedStyle.position,
                                zIndex: computedStyle.zIndex
                            });
                        }
                        
                        // Manual fallback: ensure the section is visible
                        if (arReadySection.classList.contains('hidden')) {
                            console.log('🔧 Manually showing AR Ready Section');
                            arReadySection.classList.remove('hidden');
                        }
                        
                        // Force show all child elements
                        const allChildren = arReadySection.querySelectorAll('*');
                        allChildren.forEach(child => {
                            if (child.classList.contains('hidden')) {
                                console.log('🔧 Removing hidden class from:', child);
                                child.classList.remove('hidden');
                            }
                            // Force display block for any elements that might be hidden
                            if (child.style.display === 'none') {
                                console.log('🔧 Setting display block for:', child);
                                child.style.display = 'block';
                            }
                        });
                        
                        // Check if elements are positioned off-screen
                        const detectionSuccessRect = arReadySection.querySelector('.detection-success');
                        const arInstructionsRect = arReadySection.querySelector('.ar-instructions');
                        const startButtonRect = arReadySection.querySelector('button');
                        
                        if (detectionSuccessRect) {
                            const rect = detectionSuccessRect.getBoundingClientRect();
                            console.log('🔍 Detection Success position:', {
                                top: rect.top,
                                left: rect.left,
                                bottom: rect.bottom,
                                right: rect.right,
                                width: rect.width,
                                height: rect.height
                            });
                        }
                        
                        if (startButtonRect) {
                            const rect = startButtonRect.getBoundingClientRect();
                            console.log('🔍 Start Button position:', {
                                top: rect.top,
                                left: rect.left,
                                bottom: rect.bottom,
                                right: rect.right,
                                width: rect.width,
                                height: rect.height
                            });
                        }
                        
                        // Force position the elements to be visible
                        if (detectionSuccessRect) {
                            detectionSuccessRect.style.position = 'relative';
                            detectionSuccessRect.style.zIndex = '10';
                            console.log('🔧 Fixed detection success positioning');
                        }
                        
                        if (arInstructionsRect) {
                            arInstructionsRect.style.position = 'relative';
                            arInstructionsRect.style.zIndex = '10';
                            console.log('🔧 Fixed ar instructions positioning');
                        }
                        
                        if (startButtonRect) {
                            startButtonRect.style.position = 'relative';
                            startButtonRect.style.zIndex = '10';
                            startButtonRect.style.marginTop = '20px';
                            console.log('🔧 Fixed start button positioning');
                        }
                    } else {
                        console.error('❌ AR Ready Section not found!');
                    }
                }, 100);
            } else {
                console.error('❌ AR Scene Manager: State manager not available');
            }
        } else {
            console.log(`⚠️ Unknown target detected: ${targetIndex}`);
            console.log(`⚠️ Available targets:`, Object.keys(this.topicMapping));
        }
    }
    
    // Start animation for the detected topic
    startAnimation(topicId) {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            const timelineController = sceneEl.components['timeline-controller'];
            if (timelineController && timelineController.isTimelineReady()) {
                console.log(`Starting animation for topic ${topicId}`);
                timelineController.startAnimeTimeline();
            } else {
                console.log(`Timeline not ready for topic ${topicId}`);
            }
        }
    }
    
    // Start animation when user clicks "Start AR Experience"
    startARExperience() {
        if (this.currentTopic) {
            console.log(`🎬 Starting AR experience for topic ${this.currentTopic}`);
            this.startAnimation(this.currentTopic);
        } else {
            console.error('❌ No topic detected - cannot start AR experience');
        }
    }
    
    // Handle target lost event
    handleTargetLost(targetIndex) {
        console.log(`Target ${targetIndex} lost`);
        
        // Pause the animation when target is lost
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            const timelineController = sceneEl.components['timeline-controller'];
            if (timelineController) {
                console.log(`Pausing animation`);
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
                console.log('🗑️ AR Scene Manager: Clearing container HTML and hiding container');
                container.innerHTML = '';
                container.classList.add('hidden');
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
        this.stopTipsRotation();
        this.disposeScene();
        console.log('AR Scene Manager reset');
    }
    
    // Check if system is ready
    isReady() {
        return this.isInitialized;
    }
    
    // Start tips rotation
    startTipsRotation() {
        if (this.tipInterval) {
            this.stopTipsRotation();
        }
        
        this.tipInterval = setInterval(() => {
            this.tipIndex = (this.tipIndex + 1) % this.tips.length;
            const tipElement = document.getElementById('tip-text');
            if (tipElement) {
                tipElement.innerHTML = this.tips[this.tipIndex];
            }
        }, 2500);
        
        console.log('Tips rotation started');
    }
    
    // Stop tips rotation
    stopTipsRotation() {
        if (this.tipInterval) {
            clearInterval(this.tipInterval);
            this.tipInterval = null;
            console.log('Tips rotation stopped');
        }
    }
    
    // Generate asset HTML for all topics (1-4)
    generateAllTopicAssets() {
        let allAssetsHTML = '<a-assets>\n';
        
        // Generate assets for all topics
        for (let topicId = 1; topicId <= 4; topicId++) {
            if (window.generateTopicAssetHTML) {
                const topicAssetHTML = window.generateTopicAssetHTML(topicId);
                // Extract content between <a-assets> tags
                const assetContent = topicAssetHTML.replace(/<\/?a-assets>/g, '').trim();
                if (assetContent) {
                    allAssetsHTML += `    <!-- Topic ${topicId} Assets -->\n`;
                    allAssetsHTML += assetContent + '\n';
                }
            }
        }
        
        allAssetsHTML += '</a-assets>';
        return allAssetsHTML;
    }
    
    // Add entities to specific topic container when detected
    addEntitiesToTopic(topicId) {
        const topicContainer = document.getElementById(`scenario-assets-topic-${topicId}`);
        if (topicContainer && window.generateTopicEntityHTML) {
            const entityHTML = window.generateTopicEntityHTML(topicId);
            if (entityHTML) {
                topicContainer.innerHTML = entityHTML;
                console.log(`Added entities for topic ${topicId}`);
            }
        }
    }


    injectARScene() {
        // Show the AR scene container
        const container = document.getElementById('ar-scene-container');
        if (container) {
            container.classList.remove('hidden');
            console.log('AR scene container shown');
        }
        
        // Generate dynamic asset HTML for all topics (1-4)
        const assetHTML = this.generateAllTopicAssets();
        
        const arSceneHTML = `   
        <a-scene id="AR-scene"  
            mindar-image="imageTargetSrc: ./assets/targets/targets_4.mind; 
            filterMinCF: 0.0001; 
            filterBeta: 0.001; 
            warmupTolerance: 1; 
            missTolerance: 1; 
            maxTrack: 4;
            autoStart: true;" 
            timeline-controller
            color-space="sRGB" 
            renderer="colorManagement: true, physicallyCorrectLights"
            xr-mode-ui="enabled: false" 
            loading-screen="enabled: false"
            device-orientation-permission-ui="enabled: false">  

            ${assetHTML}

            <div id="timelineContainer" style="display: none;"></div>
            
            <!-- Topic containers - always present for MindAR detection -->
            <a-entity id="scenario-assets-topic-1" position="0 0 -2" mindar-image-target="targetIndex: 0">
                <!-- Topic 1 entities will be added dynamically -->
            </a-entity>
            <a-entity id="scenario-assets-topic-2" position="0 0 -2" mindar-image-target="targetIndex: 1">
                <!-- Topic 2 entities will be added dynamically -->
            </a-entity>
            <a-entity id="scenario-assets-topic-3" position="0 0 -2" mindar-image-target="targetIndex: 2">
                <!-- Topic 3 entities will be added dynamically -->
            </a-entity>
            <a-entity id="scenario-assets-topic-4" position="0 0 -2" mindar-image-target="targetIndex: 3">
                <!-- Topic 4 entities will be added dynamically -->
            </a-entity>

            <a-camera position="0 0 2" look-controls="enabled: false" cursor="rayOrigin: mouse"></a-camera>
        </a-scene>`;

        // Inject into the dedicated container instead of body
        if (container) {
            container.innerHTML = arSceneHTML;
            console.log('AR Scene has been injected into dedicated container');
        } else {
            document.body.insertAdjacentHTML('beforeend', arSceneHTML);
            console.log('AR Scene has been injected into body (fallback)');
        }

        // Set up MindAR event listeners after scene is injected
        this.setupMindARListeners();

        const sceneEl = document.querySelector('a-scene');
    }

}

// Create global instance
window.arSceneManager = new ARSceneManager();
console.log('AR Scene Manager loaded');
