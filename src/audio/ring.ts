export class Ring{
    ctx: AudioContext;
    osc: OscillatorNode;
    gainNode: GainNode;
    started = false;
    constructor() {
        const ctx = new window.AudioContext();
        this.ctx = ctx;
        this.osc = ctx.createOscillator();
        this.osc.type = "sine";
        this.osc.frequency.value = 2000;
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = 0.00;
        this.osc.connect(this.gainNode);
        this.gainNode.connect(ctx.destination);

    }
    play(){
        if(!this.started){
            this.osc.start();
            this.started = true;
        }
        const space = 40;
        const duration = 250;
        let count = 15;
        const interval = setInterval(()=>{
            if(count <0){
                clearInterval(interval);
            }
            else{
                this.gainNode.gain.value = 0.1;
                setTimeout(()=>{
                    this.gainNode.gain.value = 0;
                }, space);

            }
            count--;
        }, space + duration);
    }
}