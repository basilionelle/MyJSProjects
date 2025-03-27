export class Stats {
    constructor(storage) {
        this.storage = storage;
        this.stats = this.storage.getStats();
        this.updateDisplay();
    }

    updateStats(wasWorkSession) {
        if (wasWorkSession) {
            const today = new Date().toDateString();
            const lastDate = this.stats.lastSessionDate;
            
            // Update streak
            if (lastDate === today) {
                // Multiple sessions in the same day, streak continues
            } else if (lastDate && new Date(lastDate).toDateString() === new Date(Date.now() - 86400000).toDateString()) {
                // Session on consecutive days, increment streak
                this.stats.currentStreak++;
            } else if (lastDate && new Date(lastDate).toDateString() !== today) {
                // Break in streak, reset
                this.stats.currentStreak = 1;
            } else {
                // First ever session
                this.stats.currentStreak = 1;
            }

            // Update session count and time
            this.stats.totalSessions++;
            this.stats.totalWorkTime += 25; // Add work session duration in minutes
            this.stats.lastSessionDate = today;

            this.storage.updateStats(this.stats);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        document.getElementById('sessionCount').textContent = this.stats.totalSessions;
        document.getElementById('totalTime').textContent = this.formatTime(this.stats.totalWorkTime);
        document.getElementById('currentStreak').textContent = this.stats.currentStreak;
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
}
