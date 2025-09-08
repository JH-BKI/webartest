// Timeline Data for Scene 01
// This file contains all the anime.js timeline configuration

// Make the function globally available
window.createTimeline = function(timelineController) {
  const { timeline, addPause } = timelineController;
  let itemNumber = 1;
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  // Scene 01: Fade In (Mia and Alex simultaneously)
  ///////////////////////////////////////////////////////////////////////////////////////////
  timeline
    .add({
      targets: '#scenario',
      opacity: [1, 1],
      duration: 10, // Instant change
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: First timeline node completed.`);
      },
      error: (error) => {
        console.error(`Timeline Item ${itemNumber} Error: First timeline node failed -`, error);
      }  
    });

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Scene 08: Fade In 
  /////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  timeline
           
    .add({
      targets: '.scenario-ui-prompt-speech.info',
      opacity: [0, 1],
      duration: 1000, // Instant change
      easing: 'linear',
      delay: 5000,
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Setting the general info (Scene 07)`);
        const infoElement = document.querySelector('.scenario-ui-prompt-speech.info');
        if (infoElement) {
            infoElement.innerHTML = `<h4>Moving on...</h4>
<p>Topic 3: ending info text</p><p>Topic 3: ending info text</p><p>Topic 3: ending info text</p><p>Topic 3: ending info text</p><p>Topic 3: ending info text</p>`;
        } else {
            console.warn('Element .scenario-ui-prompt-speech.info not found');
        }
        if (infoElement) {
            infoElement.style.display = "block";
        }
      },
      error: (error) => {
        console.error(`Timeline Item ${itemNumber} Error: Topic 3 general info (Scene 07) failed -`, error);
      }
    })
    .add({
      targets: '.scenario-ui-prompt-button-area',
      opacity: [0, 1],
      duration: 500,
      easing: 'linear',
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading in continue button area (Scene 08)`);
        document.querySelector('.scenario-ui-prompt-button-area').style.display = "flex";
      },
      error: (error) => {
        console.error(`Timeline Item ${itemNumber} Error: Fading in continue button area (Scene 08) failed -`, error);
      }
    }) 
    .add(addPause(0))
    .add({
      targets: ['.scenario-ui-prompt-button-area','.scenario-ui-prompt-speech.left','.scenario-ui-prompt-speech.info'],
      opacity: [1, 0],
      duration: 500,
      easing: 'linear',
      delay: 500,
      begin: () => {
        console.log(`Timeline Item ${itemNumber++}: Fading out button area and speech bubble (Scene 08)`);
      },
      complete: () => {
        const buttonArea = document.querySelector('.scenario-ui-prompt-button-area');
        const speechLeft = document.querySelector('.scenario-ui-prompt-speech.left');
        const speechInfo = document.querySelector('.scenario-ui-prompt-speech.info');
        
        if (buttonArea) buttonArea.style.display = "none";
        if (speechLeft) speechLeft.style.display = "none";
        if (speechInfo) speechInfo.style.display = "none";
      },
      error: (error) => {
        console.error(`Timeline Item ${itemNumber} Error: Fading out button area and speech bubble (Scene 08) failed -`, error);
      }
    });
}
