// Topic data for the learning app
const topicData = {
    topic_1: {
        title: 'Protecting Yourself Online',
        icon: '💻', // Can be emoji or image path like './assets/icons/topic1.png'
        videoUrl: 'https://vimeo.com/911432606?fl=pl&fe=sh', // Topic-specific video
        content: [

            'Catfishing is when someone creates a fake social media account to scam or trick you.',
            '',
            'Signs of a catfish:',
            '1. They ask lots of questions about you but avoid answering questions about themselves.',
            '2. They seem a bit too… perfect.',
            '3. They always have a reason why they can’t meet up.',
            '4. They’re not keen on video chats.',
            '5. Their stories don’t quite add up.',
            '',
            'Let’s continue to test your knowledge.'
        ],
        question: 'There are five signs of catfishing, below are three of these signs, select which three below',
        answers: [
            {text: 'They like to talk about themselves', correct: false},
            {text: 'They seem a bit too… perfect', correct: true},
            {text: 'They always have a reason why they can’t meet up', correct: true},
            {text: 'They like to do video chats so you can see who they are', correct: false},
            {text: 'Their stories don’t quite add up', correct: true}
        ],
        feedback: {
            perfect: 'Well done! Your answers are correct.',
            partial: 'Good try! Go back to watch the video again or move on to the topic summary.'
        },
        summary: [
            'Let\'s recap what you learned:',
            '',
            'The 5 signs of a catfish:',
            '1. They ask lots of questions about you but avoid answering questions about themselves.',
            '2. They seem a bit too… perfect.',
            '3. They always have a reason why they can’t meet up.',
            '4. They’re not keen on video chats.',
            '5. Their stories don’t quite add up.',
            '',
            '<b>Always be careful about what you say and share online.</b>',
            '',
            'Well done!',
            'Topic 1: Protecting Yourself Online is complete.',
            'Find all of the remaining posters to unlock a special reward.'
        ],
        targetImage: './assets/topic_1/s01-imagetarget.png',
        leftProfileImage: './assets/topic_1/leftProfileImage.png',
        rightProfileImage: './assets/topic_1/rightProfileImage.png',
        
        // AR Assets with entity properties for Topic 1
        arAssets: {
            images: [
                // Speech bubbles
                { 
                    id: 's01-speech-lt', 
                    src: './assets/topic_1/s01-speech-left.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0.125 1.125 -1',
                    rotation: '0 0 0',
                    visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01-speech-rt', 
                    src: './assets/topic_1/s01-speech-right.png',
                    scale: '0.5 0.5 0.5',
                    position: '0.125 1.125 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 01 characters
                { 
                    id: 's01s01-Alex', 
                    src: './assets/topic_1/s01-scene-01-Alex.png',
                    scale: '1 2 0.5',
                    position: '-1.25 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s01-Mia', 
                    src: './assets/topic_1/s01-scene-01-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.375 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 02 characters
                { 
                    id: 's01s02-Alex', 
                    src: './assets/topic_1/s01-scene-02-Alex.png',
                    scale: '1 2 0.5',
                    position: '-0.275 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s02-Mia', 
                    src: './assets/topic_1/s01-scene-02-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.375 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 03 characters
                { 
                    id: 's01s03-Alex', 
                    src: './assets/topic_1/s01-scene-03-Alex.png',
                    scale: '1 2 0.5',
                    position: '-0.275 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s03-Mia', 
                    src: './assets/topic_1/s01-scene-03-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.375 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 04 social media elements
                { 
                    id: 's01s04-post', 
                    src: './assets/topic_1/s01-scene-04-post.png',
                    scale: '1 1.5 0.5',
                    position: '-0 0 -0.5',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s04-heart', 
                    src: './assets/topic_1/s01-scene-04-heart.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s04-like', 
                    src: './assets/topic_1/s01-scene-04-like.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s04-share', 
                    src: './assets/topic_1/s01-scene-04-share.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s04-smile', 
                    src: './assets/topic_1/s01-scene-04-smile.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 05 characters
                { 
                    id: 's01s05-Alex', 
                    src: './assets/topic_1/s01-scene-05-Alex.png',
                    scale: '1 2 0.5',
                    position: '-0.275 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s05-Mia', 
                    src: './assets/topic_1/s01-scene-05-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.375 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 06 characters
                { 
                    id: 's01s06-Alex', 
                    src: './assets/topic_1/s01-scene-06-Alex.png',
                    scale: '1 2 0.5',
                    position: '-0.275 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s06-Mia', 
                    src: './assets/topic_1/s01-scene-06-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.375 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 07 characters
                { 
                    id: 's01s07-Alex', 
                    src: './assets/topic_1/s01-scene-07-Alex.png',
                    scale: '1 2 0.5',
                    position: '-0.275 0 -1.05',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s07-Mia', 
                    src: './assets/topic_1/s01-scene-07-Mia.png',
                    scale: '1 2 0.5',
                    position: '0.25 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                // Scene 08 action and status assets
                { 
                    id: 's01s08-profile', 
                    src: './assets/topic_1/s01-scene-08-profile.png',
                    scale: '1 1.5 0.5',
                    position: '-0 0 -0.5',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01s08-random', 
                    src: './assets/topic_1/s01-scene-08-random.png',
                    scale: '0.5 0.5 0.5',
                    position: '-0 0 -1',
                    rotation: '0 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's01-floor', 
                    src: './assets/topic_1/s01-floor.png',                // Floor
                    scale: '2 1 2',
                    position: '0 -0.5 0',
                    rotation: '-90 0 0',
                                        visible: 'true',
                    opacity: '1',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                }
            ]
        }
    },
    topic_2: {
        title: 'Navigating Difficult Situations',
        icon: '📱', // Can be emoji or image path
        videoUrl: 'https://player.vimeo.com/video/76979871', // Topic-specific video (placeholder)
        content: [
            'Digital marketing is the practice of promoting products or services using digital technologies.',
            'Search Engine Optimization (SEO) helps websites rank higher in search results.',
            'Social media marketing builds brand awareness and engages customers.',
            'Email marketing maintains relationships and drives conversions.'
        ],
        question: 'What are key digital marketing channels?',
        answers: [
            {text: 'SEO', correct: true},
            {text: 'Print Ads', correct: false},
            {text: 'Social Media', correct: true},
            {text: 'Email Marketing', correct: true},
            {text: 'Billboard Ads', correct: false}
        ],
        feedback: {
            perfect: 'Perfect! SEO, social media, and email are core digital channels.',
            partial: 'Close! Focus on digital channels: SEO, social media, and email marketing.'
        },
        summary: [
            'Digital Marketing module complete!',
            'What you learned:',
            '• SEO improves search visibility',
            '• Social media builds community',
            '• Email marketing nurtures leads',
            '• Digital channels offer measurable results'
        ],
        targetImage: './assets/topic_2/s02-imagetarget.png',
        leftProfileImage: './assets/topic_2/leftProfileImage.png',
        rightProfileImage: './assets/topic_2/rightProfileImage.png',
        
        // AR Assets with entity properties for Topic 2
        arAssets: {
            images: [
                { 
                    id: 's02-character-A', 
                    src: './assets/topic_2/s02-character-A.png',
                    scale: '1.5 3 1',
                    position: '0 0 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                },
                { 
                    id: 's02-character-B', 
                    src: './assets/topic_2/s02-character-B.png',
                    scale: '1.5 3 1',
                    position: '1 0 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                }
            ],
            videos: [
                { 
                    id: 's02-video-intro', 
                    src: './assets/topic_2/s02-video-intro.mp4',
                    scale: '2 1.5 1',
                    position: '0 1 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: ''
                }
            ]
        }
    },
    topic_3: {
        title: 'Respectful Relationships Online',
        icon: '📊', // Can be emoji or image path
        videoUrl: 'https://player.vimeo.com/video/76979871', // Topic-specific video (placeholder)
        content: [
            'Data science combines statistical analysis, programming, and domain expertise.',
            'Python and R are the most popular programming languages for data analysis.',
            'Statistical analysis helps identify patterns and trends in data.',
            'Machine learning enables computers to learn from data without explicit programming.'
        ],
        question: 'What skills do data scientists need?',
        answers: [
            {text: 'Statistics', correct: true},
            {text: 'Graphic Design', correct: false},
            {text: 'Programming', correct: true},
            {text: 'Machine Learning', correct: true},
            {text: 'Video Editing', correct: false}
        ],
        feedback: {
            perfect: 'Excellent! Statistics, programming, and ML are essential data science skills.',
            partial: 'Good start! Data scientists need technical skills like statistics and programming.'
        },
        summary: [
            'Data Science foundations established!',
            'Core concepts covered:',
            '• Statistics reveal data patterns',
            '• Programming processes large datasets',
            '• Machine learning predicts outcomes',
            '• Domain expertise guides analysis'
        ],
        targetImage: './assets/topic_3/s03-imagetarget.png',
        leftProfileImage: './assets/topic_3/leftProfileImage.png',
        rightProfileImage: './assets/topic_3/rightProfileImage.png',
        
        // AR Assets with entity properties for Topic 3
        arAssets: {
            models: [
                { 
                    id: 's03-3d-object', 
                    src: './assets/topic_3/s03-3d-object.glb',
                    scale: '1 1 1',
                    position: '0 0 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: ''
                }
            ],
            audio: [
                { 
                    id: 's03-background-music', 
                    src: './assets/topic_3/s03-background-music.mp3',
                    scale: '',
                    position: '',
                    rotation: '',
                    visible: 'false',
                    opacity: '0',
                    material: ''
                }
            ]
        }
    },
    topic_4: {
        title: 'Seeking Help and Support',
        icon: '🔒', // Can be emoji or image path
        videoUrl: 'https://player.vimeo.com/video/76979871', // Topic-specific video (placeholder)
        content: [
            'Cybersecurity protects systems, networks, and data from digital attacks.',
            'Malware includes viruses, worms, and ransomware that can damage systems.',
            'Phishing attacks trick users into revealing sensitive information.',
            'Strong passwords and two-factor authentication provide basic protection.'
        ],
        question: 'What are common cyber threats?',
        answers: [
            {text: 'Malware', correct: true},
            {text: 'Power Outages', correct: false},
            {text: 'Phishing', correct: true},
            {text: 'Ransomware', correct: true},
            {text: 'Hardware Failure', correct: false}
        ],
        feedback: {
            perfect: 'Perfect! Malware, phishing, and ransomware are major cyber threats.',
            partial: 'Good awareness! Focus on digital threats like malware and phishing attacks.'
        },
        summary: [
            'Cybersecurity awareness achieved!',
            'Security principles learned:',
            '• Malware threatens system integrity',
            '• Phishing steals personal information',
            '• Strong passwords are essential',
            '• Prevention is better than recovery'
        ],
        targetImage: './assets/topic_4/s04-imagetarget.png',
        leftProfileImage: './assets/topic_4/leftProfileImage.png',
        rightProfileImage: './assets/topic_4/rightProfileImage.png',
        
        // AR Assets with entity properties for Topic 4
        arAssets: {
            images: [
                { 
                    id: 's04-cyber-icon', 
                    src: './assets/topic_4/s04-cyber-icon.png',
                    scale: '1 1 1',
                    position: '0 0 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: 'transparent: true; alphaTest: 0.5; depthWrite: true; blending: normal'
                }
            ],
            videos: [
                { 
                    id: 's04-security-demo', 
                    src: './assets/topic_4/s04-security-demo.mp4',
                    scale: '2 1.5 1',
                    position: '0 1 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: ''
                }
            ],
            models: [
                { 
                    id: 's04-firewall-model', 
                    src: './assets/topic_4/s04-firewall-model.glb',
                    scale: '1 1 1',
                    position: '0 0 -2',
                    rotation: '0 0 0',
                    visible: 'false',
                    opacity: '0',
                    material: ''
                }
            ]
        }
    }
};

// Helper functions for topic management
function getTopicInfo(topicId) {
  const topicKey = `topic_${topicId}`;
  return topicData[topicKey] || null;
}

function getTopicTitle(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.title : 'Unknown Topic';
}

function getTopicContent(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.content : [];
}

function getTopicQuestion(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.question : 'No question available';
}

function getTopicAnswers(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.answers : [];
}

function getTopicFeedback(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.feedback : { perfect: '', partial: '' };
}

function getTopicSummary(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.summary : [];
}

function getTopicIcon(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.icon : '📚'; // Default icon if not found
}

function getTopicVideoUrl(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.videoUrl : null; // Return null if not found - let it fail gracefully
}

function getTopicTargetImage(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.targetImage : null; // Return null if not found
}

function getTopicLeftProfileImage(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.leftProfileImage : null; // Return null if not found
}

function getTopicRightProfileImage(topicId) {
  const topic = getTopicInfo(topicId);
  return topic ? topic.rightProfileImage : null; // Return null if not found
}

// New helper function to get AR assets for a topic
function getTopicARAssets(topicId) {
  const topic = getTopicInfo(topicId);
  return topic && topic.arAssets ? topic.arAssets : null;
}

// New helper function to generate asset HTML
function generateTopicAssetHTML(topicId) {
  const assets = getTopicARAssets(topicId);
  if (!assets) {
    console.warn(`No AR assets found for topic ${topicId}`);
    return '<a-assets></a-assets>';
  }
  
  let assetHTML = '<a-assets>\n';
  
  // Load images
  if (assets.images) {
    assets.images.forEach(asset => {
      assetHTML += `    <img id="asset_${asset.id}" src="${asset.src}">\n`;
    });
  }
  
  // Load videos
  if (assets.videos) {
    assets.videos.forEach(asset => {
      assetHTML += `    <video id="asset_${asset.id}" src="${asset.src}" autoplay="false" loop="false"></video>\n`;
    });
  }
  
  // Load audio
  if (assets.audio) {
    assets.audio.forEach(asset => {
      assetHTML += `    <audio id="asset_${asset.id}" src="${asset.src}" preload="auto"></audio>\n`;
    });
  }
  
  // Load 3D models
  if (assets.models) {
    assets.models.forEach(asset => {
      assetHTML += `    <a-asset-item id="asset_${asset.id}" src="${asset.src}"></a-asset-item>\n`;
    });
  }
  
  assetHTML += '</a-assets>';
  return assetHTML;
}

// New helper function to generate entity HTML with properties
function generateTopicEntityHTML(topicId) {
  const assets = getTopicARAssets(topicId);
  if (!assets) {
    console.warn(`No AR assets found for topic ${topicId}`);
    return '';
  }
  
  let entityHTML = '';
  
  // Generate entities for images
  if (assets.images) {
    assets.images.forEach(asset => {
      entityHTML += `    <a-image id="${asset.id}" src="#asset_${asset.id}"`;
      if (asset.scale) entityHTML += ` scale="${asset.scale}"`;
      if (asset.position) entityHTML += ` position="${asset.position}"`;
      if (asset.rotation) entityHTML += ` rotation="${asset.rotation}"`;
      if (asset.visible) entityHTML += ` visible="${asset.visible}"`;
      if (asset.opacity) entityHTML += ` opacity="${asset.opacity}"`;
      if (asset.material) entityHTML += ` material="${asset.material}"`;
      entityHTML += `></a-image>\n`;
    });
  }
  
  // Generate entities for videos
  if (assets.videos) {
    assets.videos.forEach(asset => {
      entityHTML += `    <a-video id="${asset.id}" src="#asset_${asset.id}"`;
      if (asset.scale) entityHTML += ` scale="${asset.scale}"`;
      if (asset.position) entityHTML += ` position="${asset.position}"`;
      if (asset.rotation) entityHTML += ` rotation="${asset.rotation}"`;
      if (asset.visible) entityHTML += ` visible="${asset.visible}"`;
      if (asset.opacity) entityHTML += ` opacity="${asset.opacity}"`;
      if (asset.material) entityHTML += ` material="${asset.material}"`;
      entityHTML += `></a-video>\n`;
    });
  }
  
  // Generate entities for 3D models
  if (assets.models) {
    assets.models.forEach(asset => {
      entityHTML += `    <a-entity id="{asset.id}" gltf-model="#asset_${asset.id}"`;
      if (asset.scale) entityHTML += ` scale="${asset.scale}"`;
      if (asset.position) entityHTML += ` position="${asset.position}"`;
      if (asset.rotation) entityHTML += ` rotation="${asset.rotation}"`;
      if (asset.visible) entityHTML += ` visible="${asset.visible}"`;
      if (asset.opacity) entityHTML += ` opacity="${asset.opacity}"`;
      if (asset.material) entityHTML += ` material="${asset.material}"`;
      entityHTML += `></a-entity>\n`;
    });
  }
  
  return entityHTML;
}

// Debug function to inspect topic details
function debugTopic(topicId) {
  const topic = getTopicInfo(topicId);
  if (!topic) {
    console.log(`❌ Topic ${topicId} not found`);
    console.log('Available topics:', Object.keys(topicData));
    return;
  }
  
  console.log(`📚 Topic ${topicId} Details:`);
  console.log('Title:', topic.title);
  console.log('Icon:', topic.icon);
  console.log('Video URL:', topic.videoUrl);
  console.log('Content:', topic.content);
  console.log('Question:', topic.question);
  console.log('Answers:', topic.answers);
  console.log('Feedback:', topic.feedback);
  console.log('Summary:', topic.summary);
  console.log('Full topic object:', topic);
}

// Debug function to show currently selected/active topic
function debugCurrentTopic() {
  // Access the currentTopic variable from app.html
  if (typeof currentTopic !== 'undefined' && currentTopic) {
    console.log(`🎯 Current Topic: ${currentTopic}`);
    debugTopic(currentTopic);
  } else {
    console.log('❌ No current topic set (currentTopic is empty or undefined)');
    console.log('Available topics:', Object.keys(topicData));
    console.log('Try: debugTopic(1), debugTopic(2), debugTopic(3), or debugTopic(4)');
  }
}



// Make topicData and helper functions available globally
window.topicData = topicData;
window.getTopicInfo = getTopicInfo;
window.getTopicTitle = getTopicTitle;
window.getTopicContent = getTopicContent;
window.getTopicQuestion = getTopicQuestion;
window.getTopicAnswers = getTopicAnswers;
window.getTopicFeedback = getTopicFeedback;
window.getTopicSummary = getTopicSummary;
window.getTopicIcon = getTopicIcon;
window.getTopicVideoUrl = getTopicVideoUrl;
window.getTopicTargetImage = getTopicTargetImage;
window.getTopicLeftProfileImage = getTopicLeftProfileImage;
window.getTopicRightProfileImage = getTopicRightProfileImage;
window.getTopicARAssets = getTopicARAssets;
window.generateTopicAssetHTML = generateTopicAssetHTML;
window.generateTopicEntityHTML = generateTopicEntityHTML;
window.debugTopic = debugTopic;
window.debugCurrentTopic = debugCurrentTopic;

