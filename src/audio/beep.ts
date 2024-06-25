export class Beep{
    gainNode: GainNode;
    osc: OscillatorNode;
    playedOnce = false;
    constructor() {
        const ctx = new window.AudioContext();
        this.osc = ctx.createOscillator();

        this.osc.type = "square";
        this.osc.frequency.value = 2000;
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = 0.0;
        this.osc.connect(this.gainNode);
        this.gainNode.connect(ctx.destination);
    }
    play(duration: number){
        if (!this.playedOnce) {
            this.osc.start();
            this.playedOnce = true;
        }
        this.gainNode.gain.value = 0.05;
        setTimeout(() => {
            this.gainNode.gain.value = 0;
        }, duration);
    }
}