import { Timer } from './timer.js';
import { Storage } from './storage.js';
import { AudioManager } from './audio.js';
import { Stats } from './stats.js';

class App {
    constructor() {
        this.timer = new Timer();
        this.storage = new Storage();
        this.audio = new AudioManager();
        this.stats = new Stats(this.storage);
        
        this.initializeUI();
        this.loadSettings();
        this.setupEventListeners();
    }

    initializeUI() {
        this.elements = {
            startPause: document.getElementById('startPause'),
            reset: document.getElementById('reset'),
            skip: document.getElementById('skip'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            workDuration: document.getElementById('workDuration'),
            breakDuration: document.getElementById('breakDuration'),
            volume: document.getElementById('volume'),
            muteToggle: document.getElementById('muteToggle'),
            themeToggle: document.getElementById('themeToggle')
        };

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    loadSettings() {
        const settings = this.storage.getSettings();
        this.elements.workDuration.value = settings.workDuration;
        this.elements.breakDuration.value = settings.breakDuration;
        this.elements.volume.value = settings.volume;
        
        this.timer.setWorkDuration(settings.workDuration);
        this.timer.setBreakDuration(settings.breakDuration);
        this.audio.setVolume(settings.volume / 100);
    }

    setupEventListeners() {
        this.elements.startPause.addEventListener('click', () => this.toggleTimer());
        this.elements.reset.addEventListener('click', () => this.resetTimer());
        this.elements.skip.addEventListener('click', () => this.skipSession());
        
        this.elements.workDuration.addEventListener('input', (e) => {
            this.timer.setWorkDuration(parseInt(e.target.value));
            this.storage.updateSettings({ workDuration: parseInt(e.target.value) });
            e.target.nextElementSibling.textContent = e.target.value;
        });

        this.elements.breakDuration.addEventListener('input', (e) => {
            this.timer.setBreakDuration(parseInt(e.target.value));
            this.storage.updateSettings({ breakDuration: parseInt(e.target.value) });
            e.target.nextElementSibling.textContent = e.target.value;
        });

        this.elements.volume.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            this.audio.setVolume(volume);
            this.storage.updateSettings({ volume: parseInt(e.target.value) });
        });

        this.elements.muteToggle.addEventListener('click', () => this.toggleMute());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Timer update event
        this.timer.onTick((time) => this.updateDisplay(time));
        this.timer.onComplete(() => this.handleSessionComplete());
    }

    toggleTimer() {
        if (this.timer.isRunning()) {
            this.timer.pause();
            this.elements.startPause.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.timer.start();
            this.elements.startPause.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    resetTimer() {
        this.timer.reset();
        this.elements.startPause.innerHTML = '<i class="fas fa-play"></i>';
        this.updateDisplay(this.timer.getTimeRemaining());
    }

    skipSession() {
        this.timer.skip();
        this.audio.playNotification();
    }

    updateDisplay(time) {
        this.elements.minutes.textContent = String(Math.floor(time / 60)).padStart(2, '0');
        this.elements.seconds.textContent = String(time % 60).padStart(2, '0');
    }

    handleSessionComplete() {
        this.audio.playNotification();
        this.stats.updateStats(this.timer.isWorkSession());
        this.elements.startPause.innerHTML = '<i class="fas fa-play"></i>';
    }

    toggleMute() {
        const isMuted = this.audio.toggleMute();
        this.elements.muteToggle.innerHTML = isMuted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.elements.themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
