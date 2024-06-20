import {dateNumSignal} from "../global.ts";

export class Ring{
    ctx: AudioContext;
    osc: OscillatorNode;
    gainNode: GainNode;
    oscStarted = false;
    startTime = 0;
    mode:"silent"|"firstTone"|"shortGap"|"secondTone"|"longGap" = "silent";
    ringCount = 0;
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
        if(!this.oscStarted){
            this.osc.start();
            this.oscStarted = true;
        }
        this.startTime = dateNumSignal.value;
        dateNumSignal.subscribe("ring",(time)=>{this.update(time)});
        this.mode = "firstTone";
        this.ringCount = 0;
        this.gainNode.gain.value = 0.4;
    }
    update(time: number){
        const elapsed = time - this.startTime;
        switch(this.mode){
            case "firstTone":
                if(elapsed > 100){
                    this.mode = "shortGap";
                    this.gainNode.gain.value = 0.00;
                }
            break;
            case "shortGap":
                if(elapsed > 150){
                    this.mode = "secondTone";
                    this.gainNode.gain.value = 0.4;
                }
                break;
            case "secondTone":
                if(elapsed > 400){
                    this.mode = "longGap";
                    this.gainNode.gain.value = 0;
                }
                break;
            case "longGap":
                if(elapsed > 600){
                    this.ringCount++;
                    if(this.ringCount >= 5){
                        dateNumSignal.unsubscribe("ring");
                        this.mode = "silent";
                    }
                    else{
                        this.mode = "firstTone";
                        this.gainNode.gain.value = 0.4;

                    }

                    this.startTime = dateNumSignal.value;
                }
                break;
        }
    }
}