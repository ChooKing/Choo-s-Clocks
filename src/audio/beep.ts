export class Beep{
    gainNode!: GainNode;
    osc!: OscillatorNode;
    ctx!: AudioContext;
    playedOnce = false;
    constructor() {


    }
    play(duration: number){
        if (!this.playedOnce) {
            this.ctx = new window.AudioContext();
            this.osc = this.ctx.createOscillator();
            this.osc.type = "square";
            this.osc.frequency.value = 2000;
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0.0;
            this.osc.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            this.osc.start();
            this.playedOnce = true;
        }
        this.gainNode.gain.value = 0.05;
        setTimeout(() => {
            this.gainNode.gain.value = 0;
        }, duration);
    }
}