// SomaBora - Study Productivity App
// Main JavaScript functionality

class SomaBora {
    constructor() {
        this.timer = {
            startTime: null,
            pausedTime: 0,
            isRunning: false,
            isPaused: false,
            interval: null
        };
        
        this.quotes = [
            { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
            { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
            { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
            { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
        ];
        
        this.reminders = {
            break: { enabled: true, interval: 25 * 60 * 1000, lastReminder: 0 },
            water: { enabled: true, interval: 60 * 60 * 1000, lastReminder: 0 },
            goal: { enabled: true }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.rotateQuote();
        this.requestNotificationPermission();
        
        // Rotate quotes every 30 seconds
        setInterval(() => this.rotateQuote(), 30000);
        
        // Check reminders every minute
        setInterval(() => this.checkReminders(), 60000);
        
        // Update stats every second when timer is running
        setInterval(() => {
            if (this.timer.isRunning) {
                this.updateDisplay();
            }
        }, 1000);
    }
    
    setupEventListeners() {
        // Timer controls are handled by global functions for simplicity
        
        // Goal setting
        const dailyTarget = document.getElementById('daily-target');
        if (dailyTarget) {
            dailyTarget.addEventListener('change', () => this.setDailyGoal());
        }
        
        // Reminder settings
        const breakReminders = document.getElementById('break-reminders');
        if (breakReminders) {
            breakReminders.addEventListener('change', (e) => {
                this.reminders.break.enabled = e.target.checked;
                this.saveData();
            });
        }
        
        const waterReminders = document.getElementById('water-reminders');
        if (waterReminders) {
            waterReminders.addEventListener('change', (e) => {
                this.reminders.water.enabled = e.target.checked;
                this.saveData();
            });
        }
        
        const goalReminders = document.getElementById('goal-reminders');
        if (goalReminders) {
            goalReminders.addEventListener('change', (e) => {
                this.reminders.goal.enabled = e.target.checked;
                this.saveData();
            });
        }
    }
    
    startTimer() {
        if (this.timer.isPaused) {
            this.timer.startTime = Date.now() - this.timer.pausedTime;
            this.timer.isPaused = false;
        } else {
            this.timer.startTime = Date.now();
            this.timer.pausedTime = 0;
        }
        
        this.timer.isRunning = true;
        
        // Update button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = false;
        
        this.showNotification("Study session started! 📚", "success");
        this.saveData();
    }
    
    pauseTimer() {
        if (this.timer.isRunning) {
            this.timer.pausedTime = Date.now() - this.timer.startTime;
            this.timer.isRunning = false;
            this.timer.isPaused = true;
            
            // Update button states
            const startBtn = document.getElementById('start-btn');
            const pauseBtn = document.getElementById('pause-btn');
            
            if (startBtn) startBtn.disabled = false;
            if (pauseBtn) pauseBtn.disabled = true;
            
            this.showNotification("Study session paused ⏸️", "warning");
            this.saveData();
        }
    }
    
    stopTimer() {
        if (this.timer.isRunning || this.timer.isPaused) {
            const sessionTime = this.timer.isPaused ? this.timer.pausedTime : Date.now() - this.timer.startTime;
            const minutes = Math.floor(sessionTime / 60000);
            
            if (minutes > 0) {
                this.recordSession(minutes);
                this.showNotification(`Great job! You studied for ${minutes} minutes! 🎉`, "success");
            }
            
            this.resetTimer();
        }
    }
    
    resetTimer() {
        this.timer = {
            startTime: null,
            pausedTime: 0,
            isRunning: false,
            isPaused: false,
            interval: null
        };
        
        // Reset button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = true;
        
        // Reset display
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        
        this.saveData();
    }
    
    updateDisplay() {
        // Update timer display
        if (this.timer.isRunning) {
            const elapsed = Date.now() - this.timer.startTime;
            this.displayTime(elapsed);
        } else if (this.timer.isPaused) {
            this.displayTime(this.timer.pausedTime);
        }
        
        // Update stats
        this.updateStats();
        this.updateProgress();
    }
    
    displayTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    recordSession(minutes) {
        const today = new Date().toDateString();
        const categoryEl = document.getElementById('session-category');
        const category = categoryEl ? this.sanitizeInput(categoryEl.value) || 'General Study' : 'General Study';
        
        // Get existing data
        const sessions = this.getData('sessions') || [];
        const dailyStats = this.getData('dailyStats') || {};
        
        // Record session
        sessions.push({
            date: today,
            minutes: Math.max(0, Math.min(480, minutes)), // Limit to reasonable range
            category: category,
            timestamp: Date.now()
        });
        
        // Update daily stats
        if (!dailyStats[today]) {
            dailyStats[today] = { minutes: 0, sessions: 0 };
        }
        dailyStats[today].minutes += minutes;
        dailyStats[today].sessions += 1;
        
        // Save data
        this.setData('sessions', sessions);
        this.setData('dailyStats', dailyStats);
        
        // Clear session input
        if (categoryEl) {
            categoryEl.value = '';
        }
        
        this.updateStats();
        this.updateProgress();
    }
    
    setDailyGoal() {
        const targetEl = document.getElementById('daily-target');
        if (!targetEl) return;
        
        let target = parseInt(targetEl.value) || 120;
        target = Math.max(15, Math.min(480, target)); // Limit to reasonable range
        
        const today = new Date().toDateString();
        const goals = this.getData('goals') || {};
        goals[today] = target;
        
        this.setData('goals', goals);
        this.updateProgress();
        this.showNotification(`Daily goal set to ${target} minutes!`, "success");
    }
    
    updateStats() {
        const today = new Date().toDateString();
        const dailyStats = this.getData('dailyStats') || {};
        const sessions = this.getData('sessions') || [];
        
        // Today's minutes
        const todayMinutes = dailyStats[today]?.minutes || 0;
        const todayMinutesEl = document.getElementById('today-minutes');
        if (todayMinutesEl) todayMinutesEl.textContent = todayMinutes;
        
        // Week's minutes
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekMinutes = Object.entries(dailyStats)
            .filter(([date]) => new Date(date) >= weekStart)
            .reduce((sum, [, stats]) => sum + stats.minutes, 0);
        const weekMinutesEl = document.getElementById('week-minutes');
        if (weekMinutesEl) weekMinutesEl.textContent = weekMinutes;
        
        // Current streak
        const streak = this.calculateStreak();
        const streakEl = document.getElementById('current-streak');
        if (streakEl) streakEl.textContent = streak;
        
        // Total sessions
        const totalSessions = sessions.length;
        const sessionsEl = document.getElementById('total-sessions');
        if (sessionsEl) sessionsEl.textContent = totalSessions;
    }
    
    updateProgress() {
        const today = new Date().toDateString();
        const dailyStats = this.getData('dailyStats') || {};
        const goals = this.getData('goals') || {};
        
        const studiedMinutes = dailyStats[today]?.minutes || 0;
        const targetMinutes = goals[today] || 120;
        
        const progressPercentage = Math.min(100, (studiedMinutes / targetMinutes) * 100);
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update text
        const studiedEl = document.getElementById('minutes-studied');
        const targetEl = document.getElementById('target-minutes');
        const percentageEl = document.getElementById('progress-percentage');
        
        if (studiedEl) studiedEl.textContent = studiedMinutes;
        if (targetEl) targetEl.textContent = targetMinutes;
        if (percentageEl) percentageEl.textContent = Math.round(progressPercentage);
    }
    
    calculateStreak() {
        const dailyStats = this.getData('dailyStats') || {};
        const goals = this.getData('goals') || {};
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toDateString();
            
            const studiedMinutes = dailyStats[dateStr]?.minutes || 0;
            const targetMinutes = goals[dateStr] || 120;
            
            if (studiedMinutes >= targetMinutes * 0.8) { // 80% of goal counts as success
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    rotateQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const quoteEl = document.getElementById('daily-quote');
        const authorEl = document.querySelector('.quote-author');
        
        if (quoteEl && authorEl) {
            quoteEl.textContent = `"${randomQuote.text}"`;
            authorEl.textContent = `- ${randomQuote.author}`;
        }
    }
    
    checkReminders() {
        const now = Date.now();
        
        // Break reminder
        if (this.reminders.break.enabled && this.timer.isRunning) {
            const studyTime = now - this.timer.startTime;
            if (studyTime >= this.reminders.break.interval && 
                now - this.reminders.break.lastReminder >= this.reminders.break.interval) {
                this.showNotification("Time for a break! 🧘‍♂️", "info");
                this.reminders.break.lastReminder = now;
            }
        }
        
        // Water reminder
        if (this.reminders.water.enabled && 
            now - this.reminders.water.lastReminder >= this.reminders.water.interval) {
            this.showNotification("Don't forget to drink water! 💧", "info");
            this.reminders.water.lastReminder = now;
        }
        
        // Goal reminder (check at 6 PM if goal not met)
        if (this.reminders.goal.enabled) {
            const hour = new Date().getHours();
            if (hour === 18) { // 6 PM
                const today = new Date().toDateString();
                const dailyStats = this.getData('dailyStats') || {};
                const goals = this.getData('goals') || {};
                
                const studiedMinutes = dailyStats[today]?.minutes || 0;
                const targetMinutes = goals[today] || 120;
                
                if (studiedMinutes < targetMinutes * 0.5) { // Less than 50% of goal
                    this.showNotification("You're behind on your daily goal! 📚", "warning");
                }
            }
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    showNotification(message, type = 'info') {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SomaBora', {
                body: message,
                icon: 'https://public-frontend-cos.metadl.com/mgx/img/favicon.png'
            });
        }
        
        // Toast notification
        const toast = document.getElementById('notification-toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }
    }
    
    // Data management with security measures
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>\"'&]/g, '').trim().substring(0, 100);
    }
    
    getData(key) {
        try {
            const data = localStorage.getItem(`somabora_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }
    
    setData(key, value) {
        try {
            localStorage.setItem(`somabora_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data. Storage might be full.', 'error');
        }
    }
    
    saveData() {
        this.setData('timer', this.timer);
        this.setData('reminders', this.reminders);
    }
    
    loadData() {
        const savedTimer = this.getData('timer');
        const savedReminders = this.getData('reminders');
        
        if (savedTimer && !savedTimer.isRunning) {
            this.timer = { ...this.timer, ...savedTimer };
        }
        
        if (savedReminders) {
            this.reminders = { ...this.reminders, ...savedReminders };
            
            // Update UI
            const breakEl = document.getElementById('break-reminders');
            const waterEl = document.getElementById('water-reminders');
            const goalEl = document.getElementById('goal-reminders');
            
            if (breakEl) breakEl.checked = this.reminders.break.enabled;
            if (waterEl) waterEl.checked = this.reminders.water.enabled;
            if (goalEl) goalEl.checked = this.reminders.goal.enabled;
        }
    }
}

// Global functions for button handlers
let app;

function startTimer() {
    if (app) app.startTimer();
}

function pauseTimer() {
    if (app) app.pauseTimer();
}

function stopTimer() {
    if (app) app.stopTimer();
}

function setDailyGoal() {
    if (app) app.setDailyGoal();
}

function hideToast() {
    const toast = document.getElementById('notification-toast');
    if (toast) toast.classList.add('hidden');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'auth.html';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (simplified for MVP)
    const isLoggedIn = localStorage.getItem('somabora_user') || 'demo_user';
    
    if (!isLoggedIn && !window.location.pathname.includes('auth.html')) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Initialize the app
    app = new SomaBora();
    
    console.log('SomaBora initialized successfully!');
});

// Service Worker registration for PWA (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}