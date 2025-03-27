export class Storage {
    constructor() {
        this.defaultSettings = {
            workDuration: 25,
            breakDuration: 5,
            volume: 50
        };
        
        this.defaultStats = {
            totalSessions: 0,
            totalWorkTime: 0,
            currentStreak: 0,
            lastSessionDate: null
        };
    }

    getSettings() {
        const stored = localStorage.getItem('pommy-settings');
        return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : this.defaultSettings;
    }

    updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        localStorage.setItem('pommy-settings', JSON.stringify(updated));
    }

    getStats() {
        const stored = localStorage.getItem('pommy-stats');
        return stored ? { ...this.defaultStats, ...JSON.parse(stored) } : this.defaultStats;
    }

    updateStats(newStats) {
        const current = this.getStats();
        const updated = { ...current, ...newStats };
        localStorage.setItem('pommy-stats', JSON.stringify(updated));
    }

    clearStats() {
        localStorage.setItem('pommy-stats', JSON.stringify(this.defaultStats));
    }
}
