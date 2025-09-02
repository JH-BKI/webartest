// Topic data for the learning app
const topicData = {
    topic_1: {
        title: 'Protecting Yourself Online',
        icon: '💻', // Can be emoji or image path like './assets/icons/topic1.png'
        videoUrl: 'https://player.vimeo.com/video/76979871', // Topic-specific video
        content: [
            'Welcome to web development! This course covers the three core technologies that power the modern web.',
            'HTML provides the structure and content of web pages, like the skeleton of a building.',
            'CSS handles the visual styling and layout, making websites beautiful and user-friendly.',
            'JavaScript adds interactivity and dynamic behavior, bringing websites to life.'
        ],
        question: 'Which are the core web development technologies?',
        answers: [
            {text: 'HTML', correct: true},
            {text: 'Python', correct: false},
            {text: 'CSS', correct: true},
            {text: 'JavaScript', correct: true},
            {text: 'Java', correct: false}
        ],
        feedback: {
            perfect: 'Excellent! HTML, CSS, and JavaScript are indeed the core web technologies.',
            partial: 'Good try! Remember: HTML for structure, CSS for styling, JavaScript for interactivity.'
        },
        summary: [
            'You completed the Web Development module!',
            'Key takeaways:',
            '• HTML structures web content',
            '• CSS styles the appearance', 
            '• JavaScript adds functionality',
            '• These three work together to create modern websites'
        ]
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
        ]
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
        ]
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
        ]
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
