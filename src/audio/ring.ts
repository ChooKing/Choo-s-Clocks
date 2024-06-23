export class Ring{
    audio: HTMLAudioElement;
    constructor() {
        this.audio = new Audio("./ring.mp3");
    }
    play(){
        this.audio.play();
    }

}