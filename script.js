// StudyBuddy - Kids Study Tutor Chatbot JavaScript

class StudyBuddy {
    constructor() {
        this.apiKey = localStorage.getItem('gemini-api-key') || '';
        this.currentSubject = null;
        this.studyStreak = parseInt(localStorage.getItem('study-streak')) || 0;
        this.difficulty = localStorage.getItem('difficulty') || 'elementary';
        this.soundEnabled = localStorage.getItem('sound-enabled') !== 'false';
        this.darkMode = localStorage.getItem('dark-mode') === 'true';
        
        // New properties for age/class tracking
        this.userAge = localStorage.getItem('user-age') || null;
        this.userClass = localStorage.getItem('user-class') || null;
        this.hasAskedAge = localStorage.getItem('has-asked-age') === 'true';
        this.isFirstConversation = !this.hasAskedAge;
        
        // Educational prompts for different subjects
        this.subjectPrompts = {
            math: {
                icon: '🔢',
                systemPrompt: `You are StudyBuddy, a fun and encouraging math tutor for kids aged 6-14. 
                Always use simple language, provide step-by-step explanations, and include fun examples.
                Use emojis and encouraging phrases. Make math feel like a game!`,
                welcomeMessage: "Hi! I'm excited to explore math with you! 🔢✨ What would you like to learn about? Numbers, shapes, or maybe some fun puzzles?",
                quickActions: ['Explain', 'Example', 'Practice Problem', 'Math Game']
            },
            science: {
                icon: '🔬',
                systemPrompt: `You are StudyBuddy, a curious and enthusiastic science tutor for kids aged 6-14.
                Explain scientific concepts with simple analogies, fun facts, and real-world examples.
                Always encourage curiosity and hands-on exploration!`,
                welcomeMessage: "Welcome to our science lab! 🔬🌟 I love discovering how the world works! What scientific mystery shall we solve today?",
                quickActions: ['Explain', 'Fun Fact', 'Experiment', 'Quiz']
            },
            english: {
                icon: '📚',
                systemPrompt: `You are StudyBuddy, a creative and supportive English tutor for kids aged 6-14.
                Help with reading, writing, grammar, and vocabulary using fun stories and examples.
                Always be encouraging and make language learning enjoyable!`,
                welcomeMessage: "Let's dive into the wonderful world of words! 📚✨ I can help you with reading, writing, or we can create stories together!",
                quickActions: ['Explain', 'Story Time', 'Word Game', 'Grammar Help']
            },
            history: {
                icon: '🏛️',
                systemPrompt: `You are StudyBuddy, an adventurous history tutor for kids aged 6-14.
                Tell historical stories like exciting adventures, focusing on interesting people and events.
                Make the past come alive with vivid descriptions and fun facts!`,
                welcomeMessage: "Ready for a time travel adventure? 🏛️⏰ History is full of amazing stories and incredible people! Where shall we explore first?",
                quickActions: ['Story', 'Timeline', 'Fun Facts', 'Quiz']
            },
            geography: {
                icon: '🌍',
                systemPrompt: `You are StudyBuddy, an explorer geography tutor for kids aged 6-14.
                Share fascinating facts about places, cultures, and natural wonders around the world.
                Make geography feel like an exciting journey of discovery!`,
                welcomeMessage: "Let's explore our amazing planet together! 🌍🗺️ I can tell you about different countries, cultures, and natural wonders!",
                quickActions: ['Explore', 'Fun Facts', 'Culture', 'Geography Game']
            },
            art: {
                icon: '🎨',
                systemPrompt: `You are StudyBuddy, a creative and inspiring art tutor for kids aged 6-14.
                Encourage creativity, teach art techniques, and share information about famous artists.
                Always be supportive and help kids express themselves through art!`,
                welcomeMessage: "Welcome to our art studio! 🎨✨ Art is all about expressing yourself and having fun! What would you like to create or learn about today?",
                quickActions: ['Technique', 'Artist Story', 'Art Project', 'Color Theory']
            }
        };

        // Emoji collections for the picker
        this.emojiCategories = {
            smileys: ['😊', '😂', '🤔', '😍', '🤗', '😎', '🥳', '🤓', '😴', '😋', '🤯', '🥰'],
            animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'],
            food: ['🍎', '🍌', '🍓', '🍕', '🍔', '🍰', '🍪', '🍫', '🍦', '🧁', '🥨', '🥪'],
            activities: ['⚽', '🏀', '🎯', '🎮', '🎨', '🎵', '📚', '🔬', '🧩', '🎪', '🎭', '🎪'],
            objects: ['📚', '✏️', '🖍️', '📐', '🔍', '💡', '🎈', '🎁', '⭐', '🌟', '🔥', '💎']
        };

        this.init();
    }

    async init() {
        this.showLoadingScreen();
        await this.setupEventListeners();
        this.applySettings();
        this.hideLoadingScreen();
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            this.playSound('startup');
        }, 2000);
    }

    async setupEventListeners() {
        // Subject selection
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subject = e.currentTarget.dataset.subject;
                this.selectSubject(subject);
            });
        });

        // Chat functionality
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Character counter
        document.getElementById('user-input').addEventListener('input', (e) => {
            document.getElementById('char-count').textContent = e.target.value.length;
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Navigation
        document.getElementById('back-btn').addEventListener('click', () => this.goBack());

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.closeSettings());
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());

        // Theme toggle
        document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());

        // Reset age button
        document.getElementById('reset-age-btn').addEventListener('click', () => this.resetAge());

        // Voice input (if supported)
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            document.getElementById('voice-btn').addEventListener('click', () => this.startVoiceInput());
        } else {
            document.getElementById('voice-btn').style.display = 'none';
        }

        // Emoji picker
        document.getElementById('emoji-btn').addEventListener('click', () => this.toggleEmojiPicker());
        this.setupEmojiPicker();

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeSettings();
            }
            if (!document.getElementById('emoji-picker').contains(e.target) && 
                !document.getElementById('emoji-btn').contains(e.target)) {
                this.closeEmojiPicker();
            }
        });
    }

    selectSubject(subject) {
        this.currentSubject = subject;
        const subjectData = this.subjectPrompts[subject];
        
        // Update UI
        document.getElementById('subject-panel').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        document.getElementById('current-subject-icon').textContent = subjectData.icon;
        document.getElementById('current-subject-name').textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
        
        // Update streak counter
        document.getElementById('streak-count').textContent = this.studyStreak;
        
        // Clear messages and show welcome
        const messagesArea = document.getElementById('messages');
        messagesArea.innerHTML = '';
        
        // Check if we need to ask for age/class first
        if (!this.hasAskedAge) {
            this.askForAgeAndClass();
        } else {
            // Show personalized welcome message
            const personalizedWelcome = this.getPersonalizedWelcome(subjectData.welcomeMessage);
            this.addMessage('bot', personalizedWelcome);
        }
        
        // Update quick actions
        this.updateQuickActions(subjectData.quickActions);
        
        this.playSound('select');
        this.showProgressToast(`Let's learn ${subject}! 🌟`);
    }

    updateQuickActions(actions) {
        const quickActionsContainer = document.querySelector('.quick-actions');
        quickActionsContainer.innerHTML = '';
        
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-btn';
            btn.dataset.action = action.toLowerCase().replace(' ', '-');
            btn.textContent = this.getActionIcon(action) + ' ' + action;
            quickActionsContainer.appendChild(btn);
            
            btn.addEventListener('click', (e) => {
                const actionType = e.currentTarget.dataset.action;
                this.handleQuickAction(actionType);
            });
        });
    }

    getActionIcon(action) {
        const icons = {
            'Explain': '🤔',
            'Example': '💡',
            'Practice Problem': '✏️',
            'Math Game': '🎯',
            'Fun Fact': '🤓',
            'Experiment': '⚗️',
            'Quiz': '❓',
            'Story Time': '📖',
            'Word Game': '🔤',
            'Grammar Help': '📝',
            'Story': '📜',
            'Timeline': '⏰',
            'Explore': '🗺️',
            'Culture': '🏛️',
            'Geography Game': '🌍',
            'Technique': '🖌️',
            'Artist Story': '👨‍🎨',
            'Art Project': '🎨',
            'Color Theory': '🌈'
        };
        return icons[action] || '💫';
    }

    async handleQuickAction(action) {
        const prompts = {
            'explain': `Can you explain something about ${this.currentSubject} in a simple and fun way?`,
            'example': `Can you give me a fun example related to ${this.currentSubject}?`,
            'practice-problem': `Can you give me a practice problem for ${this.currentSubject}?`,
            'math-game': 'Can you teach me a fun math game?',
            'fun-fact': `Tell me a cool fun fact about ${this.currentSubject}!`,
            'experiment': 'Can you suggest a safe science experiment I can try?',
            'quiz': `Quiz me about ${this.currentSubject}!`,
            'story-time': 'Can you tell me an interesting story?',
            'word-game': 'Let\'s play a fun word game!',
            'grammar-help': 'Can you help me with grammar?',
            'timeline': 'Can you show me a timeline of important events?',
            'explore': 'Let\'s explore a new place!',
            'culture': 'Tell me about different cultures!',
            'geography-game': 'Let\'s play a geography game!',
            'technique': 'Can you teach me an art technique?',
            'artist-story': 'Tell me about a famous artist!',
            'art-project': 'Can you suggest an art project?',
            'color-theory': 'Teach me about colors!'
        };

        const prompt = prompts[action] || `Tell me something interesting about ${this.currentSubject}!`;
        
        // Add user message
        this.addMessage('user', prompt);
        
        // Send to AI
        await this.sendToGemini(prompt);
        
        this.playSound('click');
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.apiKey) {
            this.showProgressToast('Please set your Gemini API key in settings! ⚙️');
            this.openSettings();
            return;
        }
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        document.getElementById('char-count').textContent = '0';
        
        // Check if this is an age/class response
        const isAgeResponse = !this.hasAskedAge;
        
        // Send to AI
        await this.sendToGemini(message, isAgeResponse);
        
        // Increment streak only after age is set
        if (this.hasAskedAge) {
            this.studyStreak++;
            localStorage.setItem('study-streak', this.studyStreak.toString());
            document.getElementById('streak-count').textContent = this.studyStreak;
        }
        
        this.playSound('send');
    }

    async sendToGemini(message, isAgeQuestion = false) {
        const sendBtn = document.getElementById('send-btn');
        const originalContent = sendBtn.innerHTML;
        
        // Add generating message with typing indicator
        const generatingMessage = this.addGeneratingMessage();
        
        // Show loading on send button
        sendBtn.innerHTML = '<div class="loading"></div>';
        sendBtn.disabled = true;
        
        try {
            const subjectData = this.subjectPrompts[this.currentSubject];
            let systemPrompt;
            
            if (isAgeQuestion) {
                systemPrompt = `You are StudyBuddy, a friendly AI tutor for kids. The user just told you their age/class. 
                Acknowledge this warmly and remember it for future conversations. Be encouraging and age-appropriate.
                User's age/class: ${message}`;
            } else {
                systemPrompt = subjectData.systemPrompt + `\n\nDifficulty level: ${this.difficulty}`;
                if (this.userAge || this.userClass) {
                    systemPrompt += `\n\nUser's age/class: ${this.userAge || this.userClass}. Always keep this in mind and tailor your responses accordingly.`;
                }
            }
            
            // Add 15-second delay
            await this.delay(15000);
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nStudent question: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove generating message
            this.removeGeneratingMessage(generatingMessage);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                this.addMessage('bot', aiResponse);
                this.playSound('receive');
                
                // Handle age/class response
                if (isAgeQuestion) {
                    this.handleAgeResponse(message);
                }
                
                // Random encouragement
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        this.showProgressToast(this.getRandomEncouragement());
                    }, 2000);
                }
            } else {
                throw new Error('No response from AI');
            }
            
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            this.removeGeneratingMessage(generatingMessage);
            this.addMessage('bot', "Oops! I'm having trouble connecting right now. 😅 Can you try asking again?");
            this.playSound('error');
        } finally {
            // Restore button
            sendBtn.innerHTML = originalContent;
            sendBtn.disabled = false;
        }
    }

    addMessage(sender, content) {
        const messagesArea = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const avatar = sender === 'bot' ? '🤖' : '👦';
        const bubbleClass = sender === 'bot' ? 'bot-bubble' : 'user-bubble';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble ${bubbleClass}">
                <p>${this.formatMessage(content)}</p>
            </div>
        `;
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
        // Animate message appearance
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.5s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    formatMessage(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    getRandomEncouragement() {
        const encouragements = [
            "Great question! Keep being curious! 🌟",
            "You're doing amazing! 🎉",
            "I love how you're thinking! 💭",
            "Keep up the fantastic work! 🚀",
            "You're such a smart learner! 🧠✨",
            "That's the spirit! Keep exploring! 🔍",
            "Wow, you're really getting it! 🌈",
            "Your curiosity is awesome! 🦋"
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    goBack() {
        document.getElementById('chat-container').style.display = 'none';
        document.getElementById('subject-panel').style.display = 'block';
        this.currentSubject = null;
        this.playSound('back');
    }

    openSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
        document.getElementById('api-key').value = this.apiKey;
        document.getElementById('difficulty').value = this.difficulty;
        document.getElementById('sound-toggle').checked = this.soundEnabled;
        document.getElementById('dark-mode-toggle').checked = this.darkMode;
        
        // Update age display
        const ageDisplay = document.getElementById('current-age-display');
        if (this.userAge && this.userClass) {
            ageDisplay.textContent = `Age: ${this.userAge}, Class: ${this.userClass}`;
        } else if (this.userAge) {
            ageDisplay.textContent = `${this.userAge}`;
        } else if (this.userClass) {
            ageDisplay.textContent = `${this.userClass}`;
        } else {
            ageDisplay.textContent = 'Not set';
        }
    }

    closeSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    saveSettings() {
        this.apiKey = document.getElementById('api-key').value;
        this.difficulty = document.getElementById('difficulty').value;
        this.soundEnabled = document.getElementById('sound-toggle').checked;
        this.darkMode = document.getElementById('dark-mode-toggle').checked;
        
        // Save to localStorage
        localStorage.setItem('gemini-api-key', this.apiKey);
        localStorage.setItem('difficulty', this.difficulty);
        localStorage.setItem('sound-enabled', this.soundEnabled.toString());
        localStorage.setItem('dark-mode', this.darkMode.toString());
        
        this.applySettings();
        this.closeSettings();
        this.showProgressToast('Settings saved! 💾');
        this.playSound('success');
    }

    applySettings() {
        // Apply dark mode
        if (this.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('dark-mode', this.darkMode.toString());
        this.applySettings();
        this.playSound('click');
    }

    // Voice input functionality
    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showProgressToast('Voice input not supported on this device 🎤');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        const voiceBtn = document.getElementById('voice-btn');
        voiceBtn.style.background = '#ff6b6b';
        voiceBtn.textContent = '🎙️';

        recognition.onstart = () => {
            this.showProgressToast('Listening... Speak now! 🎤');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-input').value = transcript;
            document.getElementById('char-count').textContent = transcript.length;
            this.playSound('success');
        };

        recognition.onerror = (event) => {
            this.showProgressToast('Could not hear you clearly. Try again! 🎤');
            this.playSound('error');
        };

        recognition.onend = () => {
            voiceBtn.style.background = '';
            voiceBtn.textContent = '🎤';
        };

        recognition.start();
        this.playSound('click');
    }

    // Emoji picker functionality
    setupEmojiPicker() {
        const emojiGrid = document.getElementById('emoji-grid');
        const categoryBtns = document.querySelectorAll('.emoji-cat-btn');
        
        // Setup category buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.showEmojiCategory(e.target.dataset.category);
            });
        });
        
        // Show default category
        this.showEmojiCategory('smileys');
    }

    showEmojiCategory(category) {
        const emojiGrid = document.getElementById('emoji-grid');
        const emojis = this.emojiCategories[category] || this.emojiCategories.smileys;
        
        emojiGrid.innerHTML = '';
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.addEventListener('click', () => {
                const input = document.getElementById('user-input');
                input.value += emoji;
                document.getElementById('char-count').textContent = input.value.length;
                this.closeEmojiPicker();
                input.focus();
                this.playSound('click');
            });
            emojiGrid.appendChild(btn);
        });
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
    }

    closeEmojiPicker() {
        document.getElementById('emoji-picker').style.display = 'none';
    }

    showProgressToast(message) {
        const toast = document.getElementById('progress-toast');
        const messageSpan = toast.querySelector('.toast-message');
        
        messageSpan.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different sounds
            const frequencies = {
                click: 800,
                send: 1000,
                receive: 600,
                success: 1200,
                error: 300,
                back: 400,
                select: 900,
                startup: 700
            };
            
            oscillator.frequency.value = frequencies[type] || 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            
        } catch (error) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Sound effect:', type);
        }
    }

    // New methods for age/class functionality
    askForAgeAndClass() {
        const ageQuestion = `Hi there! 👋 I'm StudyBuddy, your AI study friend! 🤖✨
        
        Before we start learning together, I'd love to know more about you so I can help you better! 
        
        Could you please tell me:
        📚 What grade/class are you in? (like "Grade 3" or "Class 5")
        OR
        🎂 How old are you? (like "I'm 8 years old")
        
        This helps me explain things in the perfect way for you! 😊`;
        
        this.addMessage('bot', ageQuestion);
    }

    handleAgeResponse(response) {
        // Extract age or class from response
        const ageMatch = response.match(/(\d+)\s*years?\s*old/i) || response.match(/age\s*(\d+)/i) || response.match(/(\d+)/);
        const classMatch = response.match(/grade\s*(\d+)/i) || response.match(/class\s*(\d+)/i);
        
        if (ageMatch) {
            this.userAge = ageMatch[1];
            localStorage.setItem('user-age', this.userAge);
        }
        
        if (classMatch) {
            this.userClass = classMatch[1];
            localStorage.setItem('user-class', this.userClass);
        }
        
        // If no specific age/class found, store the whole response
        if (!ageMatch && !classMatch) {
            this.userAge = response;
            localStorage.setItem('user-age', response);
        }
        
        // Mark that we've asked for age
        this.hasAskedAge = true;
        localStorage.setItem('has-asked-age', 'true');
        
        // Update difficulty based on age if provided
        if (this.userAge && !isNaN(this.userAge)) {
            const age = parseInt(this.userAge);
            if (age <= 8) {
                this.difficulty = 'beginner';
            } else if (age <= 11) {
                this.difficulty = 'elementary';
            } else {
                this.difficulty = 'intermediate';
            }
            localStorage.setItem('difficulty', this.difficulty);
        }
        
        // Show personalized welcome for current subject
        setTimeout(() => {
            const subjectData = this.subjectPrompts[this.currentSubject];
            const personalizedWelcome = this.getPersonalizedWelcome(subjectData.welcomeMessage);
            this.addMessage('bot', personalizedWelcome);
        }, 1000);
    }

    getPersonalizedWelcome(originalMessage) {
        let greeting = "Great to see you again! 🌟 ";
        
        if (this.userAge && !isNaN(this.userAge)) {
            greeting += `I remember you're ${this.userAge} years old. `;
        } else if (this.userClass) {
            greeting += `I remember you're in ${this.userClass}. `;
        } else if (this.userAge) {
            greeting += `I remember you told me: ${this.userAge}. `;
        }
        
        greeting += originalMessage;
        return greeting;
    }

    addGeneratingMessage() {
        const messagesArea = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message generating-message';
        messageDiv.id = 'generating-message';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble bot-bubble generating-bubble">
                <div class="generating-content">
                    <span class="generating-text">StudyBuddy is thinking</span>
                    <div class="generating-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="generating-timer">
                    <div class="timer-bar"></div>
                    <span class="timer-text">Generating response...</span>
                </div>
            </div>
        `;
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
        // Animate the timer bar
        const timerBar = messageDiv.querySelector('.timer-bar');
        timerBar.style.width = '0%';
        setTimeout(() => {
            timerBar.style.transition = 'width 15s linear';
            timerBar.style.width = '100%';
        }, 100);
        
        return messageDiv;
    }

    removeGeneratingMessage(messageDiv) {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetAge() {
        // Clear age/class information
        this.userAge = null;
        this.userClass = null;
        this.hasAskedAge = false;
        this.isFirstConversation = true;
        
        // Clear from localStorage
        localStorage.removeItem('user-age');
        localStorage.removeItem('user-class');
        localStorage.removeItem('has-asked-age');
        
        // Reset streak
        this.studyStreak = 0;
        localStorage.setItem('study-streak', '0');
        document.getElementById('streak-count').textContent = '0';
        
        // Update display
        document.getElementById('current-age-display').textContent = 'Not set';
        
        // Show confirmation
        this.showProgressToast('Age information reset! StudyBuddy will ask again. 🔄');
        this.playSound('success');
        
        // Close settings
        this.closeSettings();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studyBuddy = new StudyBuddy();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Prevent zoom on double tap (mobile optimization)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle viewport changes for mobile keyboards
function handleViewportChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', handleViewportChange);
window.addEventListener('orientationchange', handleViewportChange);
handleViewportChange();