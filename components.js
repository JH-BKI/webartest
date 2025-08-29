// A-Frame Components for Scene 01
// This file contains all component registrations

// Wait for A-Frame to be ready
AFRAME.registerComponent('state-tracker', {
  init: function() {
    // Define the 5 states
    this.states = ['Start','Loading', 'Menu', 'Scenario-Scan', 'Scenario-Animate','Scenario-Video', 'Scenario-Quiz', 'Scenario-Finish','Filter'];
    this.currentState = 'Start';
    this.stateCallbacks = {};
    
    // Initialize callbacks for each state
    this.states.forEach(state => {
      this.stateCallbacks[state] = {
        onEnter: [],
        onExit: []
      };
    });
    
    // Expose state tracker globally for easy access
    window.appState = {
      setState: this.setState.bind(this),
      getCurrentState: this.getCurrentState.bind(this),
      addStateCallback: this.addStateCallback.bind(this)
    };
    
    console.log('State Tracker initialized. Current state:', this.currentState);
  },
  
  setState: function(newState) {
    if (!this.states.includes(newState)) {
      console.error('Invalid state:', newState);
      return;
    }
    
    if (newState === this.currentState) {
      console.log('Already in state:', newState);
      return;
    }
    
    const oldState = this.currentState;
    
    // Execute onExit callbacks for current state
    this.stateCallbacks[oldState].onExit.forEach(callback => {
      try {
        callback(oldState, newState);
      } catch (error) {
        console.error('Error in onExit callback for', oldState, ':', error);
      }
    });
    
    // Change state
    this.currentState = newState;
    console.log('State changed from', oldState, 'to', newState);
    
    // Execute onEnter callbacks for new state
    this.stateCallbacks[newState].onEnter.forEach(callback => {
      try {
        callback(newState, oldState);
      } catch (error) {
        console.error('Error in onEnter callback for', newState, ':', error);
      }
    });
  },
  
  getCurrentState: function() {
    return this.currentState;
  },
  
  addStateCallback: function(state, type, callback) {
    if (!this.states.includes(state)) {
      console.error('Invalid state:', state);
      return;
    }
    
    if (type !== 'onEnter' && type !== 'onExit') {
      console.error('Invalid callback type. Use "onEnter" or "onExit"');
      return;
    }
    
    this.stateCallbacks[state][type].push(callback);
    console.log(`Added ${type} callback for state: ${state}`);
  }
});




AFRAME.registerComponent('timeline-controller', {
  init: function() {
    this.scene = this.el;
    this.timeline = null;
    this.isPaused = false;
    this.currentScene = 1;
    this.currentTimescale = 1.0;
    this.startAtItem = 0; // Item to start at when pressing ]
    
    // Wait for scene to be fully loaded before starting timeline
    this.el.addEventListener('loaded', this.onSceneLoaded.bind(this));
    
    // Add click handler to advance timeline
    
         // Add click handler for UI button
         this.uiButton = document.querySelector('#scenario-ui-prompt-button');
         if (this.uiButton) {
           this.uiButton.addEventListener('click', this.advanceTimeline.bind(this));
         }
    
    // Add keyboard controls for timescale
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  },
  
  onSceneLoaded: function() {
    // Timeline will not start automatically - user must trigger it manually
    console.log('Scene loaded - timeline ready but not started automatically');
    console.log('Press SPACE to start the timeline, or use other controls');
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
    console.log('Starting anime.js timeline...');
    
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
      }
    });
    
    // Use the external timeline
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
  }
});
