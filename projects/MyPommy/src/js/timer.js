export class Timer {
    constructor() {
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.timeRemaining = this.workDuration;
        this.isWork = true;
        this.running = false;
        this.tickCallback = null;
        this.completeCallback = null;
    }

    setWorkDuration(minutes) {
        this.workDuration = minutes * 60;
        if (this.isWork && !this.running) {
            this.timeRemaining = this.workDuration;
            this.tick();
        }
    }

    setBreakDuration(minutes) {
        this.breakDuration = minutes * 60;
        if (!this.isWork && !this.running) {
            this.timeRemaining = this.breakDuration;
            this.tick();
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.tick();
            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        this.running = false;
        clearInterval(this.interval);
    }

    reset() {
        this.pause();
        this.timeRemaining = this.isWork ? this.workDuration : this.breakDuration;
        this.tick();
    }

    skip() {
        this.pause();
        this.isWork = !this.isWork;
        this.timeRemaining = this.isWork ? this.workDuration : this.breakDuration;
        this.tick();
    }

    tick() {
        if (this.running) {
            this.timeRemaining--;
            
            if (this.timeRemaining <= 0) {
                this.pause();
                this.isWork = !this.isWork;
                this.timeRemaining = this.isWork ? this.workDuration : this.breakDuration;
                if (this.completeCallback) this.completeCallback();
            }
        }
        
        if (this.tickCallback) {
            this.tickCallback(this.timeRemaining);
        }
    }

    onTick(callback) {
        this.tickCallback = callback;
    }

    onComplete(callback) {
        this.completeCallback = callback;
    }

    isRunning() {
        return this.running;
    }

    isWorkSession() {
        return this.isWork;
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }
}
