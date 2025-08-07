# 🌟 StudyBuddy - AI Study Tutor for Kids

A colorful, interactive, and mobile-optimized web application that serves as an AI-powered study tutor for children aged 6-14. Built with vanilla JavaScript and powered by Google's Gemini AI, StudyBuddy makes learning fun and engaging!

![StudyBuddy Banner](https://img.shields.io/badge/StudyBuddy-AI%20Study%20Tutor-FF6B6B?style=for-the-badge&logo=robot&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Tutoring**: Intelligent conversations powered by Google Gemini AI
- **Multi-Subject Support**: Math, Science, English, History, Geography, and Art
- **Age-Appropriate Content**: Tailored responses for different difficulty levels (Ages 6-14)
- **Interactive Learning**: Quick action buttons for instant learning activities
- **Progress Tracking**: Study streak counter to motivate continuous learning

### 🎨 Kid-Friendly Design
- **Colorful Interface**: Vibrant gradients and playful color scheme
- **Animated Elements**: Smooth animations and transitions for engaging UX
- **Emoji Integration**: Built-in emoji picker for expressive communication
- **Sound Effects**: Audio feedback for interactions (can be toggled)
- **Dark Mode**: Optional dark theme for different preferences

### 📱 Mobile-First Experience
- **Responsive Design**: Optimized for phones, tablets, and desktops
- **Touch-Friendly**: Large buttons and swipe gestures
- **PWA Support**: Installable as a mobile app
- **Offline Functionality**: Works without internet (limited features)
- **Voice Input**: Speech-to-text capability for hands-free interaction

### 🛡️ Safety & Privacy
- **Content Filtering**: Built-in safety settings for age-appropriate responses
- **Local Storage**: API keys and preferences stored locally
- **No Data Collection**: Privacy-focused design with no external tracking

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/studybuddy.git
   cd studybuddy
   ```

2. **Serve the Files**
   
   **Option A: Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (if installed)**
   ```bash
   npx serve .
   ```
   
   **Option C: Using any web server**
   - Place files in your web server directory
   - Access via `http://localhost/studybuddy`

3. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - The app will load with a welcome screen

4. **Configure API Key**
   - Click the settings button (⚙️) in the top right
   - Enter your Gemini API key
   - Select appropriate difficulty level
   - Save settings

5. **Start Learning!**
   - Choose a subject from the colorful grid
   - Start chatting with StudyBuddy
   - Use quick action buttons for instant activities

## 🎓 How to Use

### Getting Started
1. **Choose a Subject**: Select from Math, Science, English, History, Geography, or Art
2. **Start Chatting**: Type questions or use voice input
3. **Use Quick Actions**: Try "Explain", "Example", "Quiz Me", or "Help"
4. **Track Progress**: Watch your study streak grow with each interaction

### Subject-Specific Features

#### 🔢 Math
- Step-by-step problem solving
- Interactive math games
- Visual explanations with examples
- Practice problems at your level

#### 🔬 Science
- Fun science facts and experiments
- Simple explanations of complex concepts
- Safe experiment suggestions
- Interactive quizzes

#### 📚 English
- Story creation and reading help
- Grammar assistance
- Vocabulary building games
- Creative writing prompts

#### 🏛️ History
- Engaging historical stories
- Timeline explanations
- Fun facts about historical figures
- Interactive history games

#### 🌍 Geography
- World exploration activities
- Cultural learning experiences
- Geography games and quizzes
- Fun facts about countries

#### 🎨 Art
- Art technique tutorials
- Artist biographies and stories
- Creative project suggestions
- Color theory lessons

### Advanced Features

#### Voice Input
- Click the microphone button (🎤)
- Speak your question clearly
- Voice will be converted to text automatically

#### Emoji Picker
- Click the emoji button (😊)
- Browse different categories
- Add emojis to make conversations fun

#### Settings Customization
- **API Key**: Set your Gemini API key
- **Difficulty Level**: Choose age-appropriate content
- **Sound Effects**: Enable/disable audio feedback
- **Dark Mode**: Switch between light and dark themes

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Gemini API
- **PWA Features**: Service Worker, Web App Manifest
- **Storage**: Local Storage for settings and preferences
- **Responsive**: CSS Grid and Flexbox for mobile-first design

### Browser Support
- Chrome 80+ ✅
- Firefox 75+ ✅
- Safari 13+ ✅
- Edge 80+ ✅
- Mobile browsers ✅

### File Structure
```
studybuddy/
├── index.html          # Main application file
├── styles.css          # All styling and animations
├── script.js           # Core JavaScript functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
└── README.md          # This file
```

### Key Technologies
- **CSS Variables**: For theming and consistency
- **CSS Grid/Flexbox**: For responsive layouts
- **Web APIs**: Speech Recognition, Local Storage, Service Workers
- **Progressive Web App**: Installable, offline-capable
- **Fetch API**: For Gemini AI integration

## 🎯 Educational Philosophy

StudyBuddy is designed with these educational principles:

### 🌱 Growth Mindset
- Encourages curiosity and exploration
- Celebrates mistakes as learning opportunities
- Provides positive reinforcement and motivation

### 🎮 Gamified Learning
- Study streaks and progress tracking
- Interactive quick actions and games
- Reward system with encouraging messages

### 🎨 Multi-Modal Learning
- Visual, auditory, and kinesthetic elements
- Text, voice, and emoji communication
- Colorful and engaging interface design

### 🧠 Age-Appropriate Content
- Adjustable difficulty levels
- Simple language and explanations
- Safe and filtered content

## 🔧 Customization

### Adding New Subjects
1. Update the `subjectPrompts` object in `script.js`
2. Add corresponding icons and styling in `styles.css`
3. Update the HTML subject grid in `index.html`

### Modifying Themes
1. Update CSS variables in `:root` selector
2. Add new color schemes for different themes
3. Update the theme toggle functionality

### Extending API Integration
1. Modify the `sendToGemini` function for different AI providers
2. Update safety settings and content filtering
3. Add new response processing logic

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/studybuddy`

### Netlify
1. Connect GitHub repository to Netlify
2. Deploy automatically on commits
3. Custom domain support available

### Vercel
1. Import project from GitHub
2. Automatic deployments and preview URLs
3. Edge network for fast global access

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
- Use GitHub Issues to report bugs
- Include browser version and steps to reproduce
- Screenshots are helpful for UI issues

### Feature Requests
- Suggest new subjects or learning activities
- Propose UI/UX improvements
- Request accessibility enhancements

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the conversational intelligence
- **Google Fonts** for the beautiful Fredoka One and Nunito fonts
- **The Education Community** for inspiration and feedback
- **Open Source Contributors** for making this project possible

## 🆘 Support

### Common Issues

**Q: The app won't load or shows errors**
- Check that you're serving files from a web server (not opening HTML directly)
- Ensure your Gemini API key is valid and entered correctly
- Check browser console for specific error messages

**Q: Voice input doesn't work**
- Voice input requires HTTPS or localhost
- Check microphone permissions in browser settings
- Ensure your browser supports Speech Recognition API

**Q: App doesn't work offline**
- Some features require internet connection
- Ensure service worker is registered properly
- Check that files are cached correctly

**Q: Responses seem inappropriate**
- Adjust difficulty level in settings
- Report any concerning content
- Check that safety settings are properly configured

### Getting Help
- 📧 Email: support@studybuddy.app
- 💬 Discord: [StudyBuddy Community](https://discord.gg/studybuddy)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/studybuddy/issues)
- 📖 Wiki: [Documentation Wiki](https://github.com/yourusername/studybuddy/wiki)

---

## 🌟 Made with ❤️ for Young Learners

StudyBuddy is more than just a chatbot - it's a companion for curious minds, a guide for educational adventures, and a friend that makes learning fun! 

**Ready to start your learning adventure? Let's go! 🚀**

---

*Last updated: December 2024*