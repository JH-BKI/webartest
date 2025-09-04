// A-Frame Timeline Controller Component
// This component dynamically loads topic-specific animation files and manages anime.js timelines
// Supports multi-topic animations with dynamic script loading

AFRAME.registerComponent('timeline-controller', {
  init: function() {
    this.scene = this.el;
    this.timeline = null;
    this.isPaused = false;
    this.currentScene = 1;
    this.currentTimescale = 1.0;
    this.startAtItem = 0;
    this.currentTopic = null; // Will store the detected topic (0, 1, 2, 3)
    this.timelineLoaded = false; // Track if topic timeline is loaded
    
    // Wait for scene to be fully loaded before starting timeline
    this.el.addEventListener('loaded', this.onSceneLoaded.bind(this));
    
    // Add click handler for UI button
    this.uiButton = document.querySelector('#scenario-ui-prompt-button');
    if (this.uiButton) {
      this.uiButton.addEventListener('click', this.advanceTimeline.bind(this));
    }
    
    // Add keyboard controls for timescale
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    
    console.log('Timeline Controller initialized - ready for topic detection');
  },
  
  onSceneLoaded: function() {
    // Timeline will not start automatically - user must trigger it manually
    console.log('Scene loaded - timeline ready but not started automatically');
    console.log('Press SPACE to start the timeline, or use other controls');
  },


  setAllARAssestsInvisible: function(topicId) {  
    const arAssets = document.querySelectorAll(`#AR-scene #scenario-assets-topic-${topicId} a-image`);
    arAssets.forEach(asset => {
      asset.setAttribute('visible', false);
      asset.setAttribute('opacity', 0);
    }); 
  },

  
  // Set the current topic and load the appropriate animation file
  setTopic: function(topicId) {
    if (topicId < 0 || topicId > 3) {
      console.error('Invalid topic ID:', topicId, '- must be 0, 1, 2, or 3');
      return false;
    }
    
    this.currentTopic = topicId;
    console.log(`Topic set to: ${topicId} - loading animation file...`);
    
    // Load the topic-specific timeline file
    return this.loadTopicAnimation(topicId);
  },

  // Dynamically load the topic-specific animation file
  loadTopicAnimation: function(topicId) {
    return new Promise((resolve, reject) => {
      // Check if we already have this timeline loaded
      if (this.timelineLoaded && window.createTimeline) {
        console.log(`Timeline for topic ${topicId} already loaded`);
        resolve(true);
        return;
      }
      
      // Create script element to load the topic-specific timeline
      const script = document.createElement('script');
      script.src = `./core/js/animations/timeline-topic-${topicId + 1}.js?v=${Date.now()}`;
      
      script.onload = () => {
        console.log(`Successfully loaded timeline for topic ${topicId}`);
        this.timelineLoaded = true;
        resolve(true);
      };
      
      script.onerror = (error) => {
        console.error(`Failed to load timeline for topic ${topicId}:`, error);
        reject(error);
      };
      
      // Add script to document head
      document.head.appendChild(script);
    });
  },

  addPause: function(duration) {
    return {
      targets: '#pauseTrigger',
      opacity: [0, 0], // No visual change
      duration: 100, // Very short duration - just enough to trigger begin()
      easing: 'linear',
      begin: () => {
        console.log(`Pause started - waiting ${duration}s for click or timer`);
        this.timeline.pause();
        
        // Store the pause duration for manual resume logic
        this.currentPauseDuration = duration;
        
        this.uiButton.textContent = `Continue (${duration}s)`;
        
        // Start countdown timer that updates button text and logs every second (only if duration > 0)
        if (duration > 0) {
          let secondsElapsed = 0;
          this.countdownInterval = setInterval(() => {
            secondsElapsed++;
            const remainingTime = duration - secondsElapsed;

            if (remainingTime > 0) {
              this.uiButton.textContent = `Continue (${remainingTime}s)`;
              console.log(`Paused ${secondsElapsed}s`);
            } else {
              // Final second - show "Continue (0s)"
              this.uiButton.textContent = `Continuing...`;
            }
          }, 1000);
        }
        
        // Start timer for auto-resume (only if duration > 0)
        if (duration > 0) {
          this.pauseTimer = setTimeout(() => {
            if (this.timeline.paused) {
              console.log(`Pause resolved by timer after ${duration}s - continuing`);
              // Clear the countdown interval
              if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
              }
              // Reset button text
              this.uiButton.textContent = 'Continuing...';
              // Resume timeline
              this.timeline.play();
            }
          }, duration * 1000);
        } else {
          // Duration is 0 - no auto-resume, just show "Continue" indefinitely
          this.uiButton.textContent = 'Continue';
          console.log('Pause started with duration 0 - waiting for manual resume only');
        }
      },
      complete: () => {
        // Animation completes quickly, but timeline is already paused
        console.log('Pause animation completed');
      }
    };
  },

  startAnimeTimeline: function() {
    // Check if we have a topic set and timeline loaded
    if (this.currentTopic === null) {
      console.error('No topic set - cannot start timeline. Call setTopic() first.');
      return;
    }
    
    if (!this.timelineLoaded || !window.createTimeline) {
      console.error('Topic timeline not loaded yet. Call setTopic() first.');
      return;
    }
    
    console.log(`Starting anime.js timeline for topic ${this.currentTopic}...`);
    
    // Create the main timeline
    this.timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 750,
      update: (anim) => {
        // anim.progress gives you 0-100 progress
        // anim.currentTime gives you current time in milliseconds
        const progress = Math.floor(anim.progress);
        if (!this.lastProgress || this.lastProgress !== progress) {
          console.log(`Timeline progress: ${progress}%`);
          this.lastProgress = progress;
        }
        
        // You can also track which specific animation is running
        if (anim.animatables && anim.animatables.length > 0) {
          console.log('Currently animating:', anim.animatables[0].target);
        }
      },
      complete: () => {
        console.log('Timeline completed');
        // Transition to video state using the state manager
        if (window.stateManager) {
          window.stateManager.changeState('video');
          
          // Load video content after state transition
          if (typeof window.loadVideoContent === 'function') {
            console.log('🎬 Loading video content after timeline completion');
            window.loadVideoContent();
          } else {
            console.error('❌ loadVideoContent function not available');
          }
        } else {
          console.error('State manager not available for timeline completion');
        }
      }
    });
    
    // Use the loaded topic-specific timeline
    window.createTimeline({
      timeline: this.timeline,
      addPause: this.addPause.bind(this)
    });
  },
  
  handleKeyPress: function(event) {
    if (this.timeline) {
      switch(event.key) {
        case '0':
          this.currentTimescale = 0;
          this.timeline.pause();
          console.log('Timescale set to 0.0x (Paused)');
          break;
        case '1':
          this.currentTimescale = 1.0;
          this.timeline.timescale = 1.0;
          this.timeline.play();
          console.log('Timescale set to 1.0x (normal speed)');
          break;
        case '2':
          this.currentTimescale = 2.0;
          this.timeline.timescale = 2.0;
          this.timeline.play();
          console.log('Timescale set to 2.0x (2x speed)');
          break;
        case '5':
          this.currentTimescale = 5.0;
          this.timeline.timescale = 5.0;
          this.timeline.play();
          console.log('Timescale set to 5.0x (5x speed)');
          break;
        case ' ':
        case 'Space':
          // Start the timeline manually
          if (this.timeline && !this.timeline.started) {
            console.log('Starting timeline manually with SPACE key');
            this.startAnimeTimeline();
          } else if (this.timeline && this.timeline.paused) {
            console.log('Resuming paused timeline with SPACE key');
            this.timeline.play();
          } else if (this.timeline && !this.timeline.paused) {
            console.log('Pausing timeline with SPACE key');
            this.timeline.pause();
          }
          break;
        case ']':
          // Start timeline at specified item (default: item 10)
          this.startAtItem = 10; // You can change this number to start at different items
          if (this.timeline) {
            this.timeline.pause();
            this.timeline.seek(this.startAtItem);
            console.log(`Timeline started at item ${this.startAtItem}`);
            this.timeline.play();
          }
          break;
      }
    }
  },
  
  quickPlay: function() {
    if (this.timeline) {
      this.timeline.play();
    } else {
      console.log('No timeline available - call startAnimeTimeline() first');
    }
  },  
  
  quickPause: function() {
    if (this.timeline) {
      this.timeline.pause();
    } else {
      console.log('No timeline available - call startAnimeTimeline() first');
    }
  },
  
  advanceTimeline: function() {
    console.log('Timeline advanced by click!');
    
    // If timeline is paused, resume it
    if (this.timeline && this.timeline.paused) {
      // Cancel the auto-resume timer since user clicked early
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        this.pauseTimer = null;
      }
      
      // Clear the countdown interval
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      
      // Resume timeline immediately - no need to complete animation
      this.timeline.timescale = this.currentTimescale;
      this.timeline.play();
      // Reset button text
      this.uiButton.textContent = 'Continue';
      console.log('Timeline resumed by click');
    } else {
      // If timeline is running, pause it (for debugging)
      console.log('Timeline is currently running');
    }
  },

  // Get current topic
  getCurrentTopic: function() {
    return this.currentTopic;
  },

  // Check if timeline is ready
  isTimelineReady: function() {
    return this.currentTopic !== null && this.timelineLoaded && window.createTimeline;
  },

  // Reset the component (useful for switching topics)
  reset: function() {
    if (this.timeline) {
      this.timeline.pause();
      this.timeline = null;
    }
    this.currentTopic = null;
    this.timelineLoaded = false;
    this.isPaused = false;
    console.log('Timeline controller reset');
  }
});
