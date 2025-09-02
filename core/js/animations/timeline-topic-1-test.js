// Test Timeline Data for Topic 1 (Web Development)
// This file contains basic anime.js timeline configuration for testing 3D content

// Make the function globally available
window.createTimeline = function(timelineController) {
  const { timeline, addPause } = timelineController;
  let itemNumber = 1;
  
  console.log('Creating test timeline for Topic 1 (Web Development)');
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  // Scene 01: Fade In 3D Content (Cube, Sphere, Pyramid)
  ///////////////////////////////////////////////////////////////////////////////////////////
  timeline
    .add({
      targets: '#topic1-cube',
      opacity: [0, 1],
      duration: 1000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading in HTML Cube (Topic 1)`);
        document.getElementById('topic1-cube').setAttribute('visible', true);
      }
    })
    .add({
      targets: '#topic1-sphere',
      opacity: [0, 1],
      duration: 1000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading in CSS Sphere (Topic 1)`);
        document.getElementById('topic1-sphere').setAttribute('visible', true);
      }
    })
    .add({
      targets: '#topic1-pyramid',
      opacity: [0, 1],
      duration: 1000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading in JavaScript Pyramid (Topic 1)`);
        document.getElementById('topic1-pyramid').setAttribute('visible', true);
      }
    })
    .add(addPause(2))
    .add({
      targets: ['#topic1-cube', '#topic1-sphere', '#topic1-pyramid'],
      opacity: [1, 0],
      duration: 1000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading out all 3D content (Topic 1)`);
      },
      complete: () => {
        document.getElementById('topic1-cube').setAttribute('visible', false);
        document.getElementById('topic1-sphere').setAttribute('visible', false);
        document.getElementById('topic1-pyramid').setAttribute('visible', false);
      }
    });

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Scene 02: Animated 3D Content with Movement
  ///////////////////////////////////////////////////////////////////////////////////////////
  timeline
    .add({
      targets: '#topic1-cube',
      opacity: [0, 1],
      position: ['0 0 0', '0 1 0'],
      duration: 1500,
      easing: 'easeInOutQuad',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Animating HTML Cube with movement (Topic 1)`);
        document.getElementById('topic1-cube').setAttribute('visible', true);
      }
    })
    .add({
      targets: '#topic1-sphere',
      opacity: [0, 1],
      rotation: ['0 0 0', '0 360 0'],
      duration: 2000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Animating CSS Sphere with rotation (Topic 1)`);
        document.getElementById('topic1-sphere').setAttribute('visible', true);
      }
    })
    .add({
      targets: '#topic1-pyramid',
      opacity: [0, 1],
      scale: ['0.5 0.5 0.5', '1 1 1'],
      duration: 1000,
      easing: 'easeOutBounce',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Animating JavaScript Pyramid with scaling (Topic 1)`);
        document.getElementById('topic1-pyramid').setAttribute('visible', true);
      }
    })
    .add(addPause(3))
    .add({
      targets: ['#topic1-cube', '#topic1-sphere', '#topic1-pyramid'],
      opacity: [1, 0],
      duration: 1000,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading out all animated 3D content (Topic 1)`);
      },
      complete: () => {
        document.getElementById('topic1-cube').setAttribute('visible', false);
        document.getElementById('topic1-sphere').setAttribute('visible', false);
        document.getElementById('topic1-pyramid').setAttribute('visible', false);
      }
    });

  console.log('Test timeline created for Topic 1 with 3D content animations');
}
