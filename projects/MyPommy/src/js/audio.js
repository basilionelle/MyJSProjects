export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.volume = 0.5;
        this.muted = false;
    }

    async playNotification() {
        if (this.muted) return;

        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(this.gainNode);
        oscillator.type = 'sine';
        
        // Play a pleasant "ding" sound
        oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    setVolume(volume) {
        this.volume = volume;
        if (!this.muted) {
            this.gainNode.gain.value = volume;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        this.gainNode.gain.value = this.muted ? 0 : this.volume;
        return this.muted;
    }
}
