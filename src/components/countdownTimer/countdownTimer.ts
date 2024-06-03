import {Clock} from "../../Clock.ts";
import {timeObj} from "../../global.ts";
import {renderTime} from "../LEDTime/LEDTime.ts";
const buttonStates = {
    set:[false, true, false,false,false],
    stop: [true, false, false,false,false],
    run:[false, false, true,false, true],
    pause:[false, false, false,true,true]
}
type timerStates = keyof typeof buttonStates;
export class CountdownTimer extends Clock{

    constructor(parent: HTMLDivElement) {
        super("countdown", parent);
        this.render(parent);
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("countdown-clock");
        const hourglass = document.createElement("div");
        hourglass.classList.add("hourglass");
        const capTop = document.createElement("div");
        capTop.classList.add("cap");
        hourglass.appendChild(capTop);
        const glassUpper = document.createElement("div");
        glassUpper.classList.add("glass");
        const sandUpper = document.createElement("div");
        sandUpper.classList.add("sand");
        glassUpper.appendChild(sandUpper);
        hourglass.appendChild(glassUpper);
        const glassLower = document.createElement("div");
        glassLower.classList.add("glass");
        const landedViewport = document.createElement("div");
        landedViewport.classList.add("landed-viewport");
        const landedSand = document.createElement("div");
        landedSand.classList.add("landed");
        landedSand.classList.add("sand");
        landedViewport.appendChild(landedSand);
        glassLower.appendChild(landedViewport);
        const sandFalling = document.createElement("div");
        sandFalling.classList.add("sand-falling");
        glassLower.appendChild(sandFalling);
        hourglass.appendChild(glassLower);
        const capBottom = document.createElement("div");
        capBottom.classList.add("cap");
        hourglass.appendChild(capBottom);
        this.element.appendChild(hourglass);


        const controls = document.createElement("div");
        controls.classList.add("controls");
        renderTime({hours:"00",minutes:"00",seconds:"00"}, controls);


        //BUTTONS
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        const setButton = document.createElement("button");
        setButton.textContent = "set";
        setButton.addEventListener("click",()=>{
            this.setState("set");
        });
        buttons.appendChild(setButton);
        const startButton = document.createElement("button");
        startButton.textContent = "start";
        startButton.addEventListener("click",()=>{
            this.setState("run");
        });
        buttons.appendChild(startButton);
        const pauseButton = document.createElement("button");
        pauseButton.textContent = "pause";
        pauseButton.addEventListener("click",()=>{
            this.setState("pause");
        });
        buttons.appendChild(pauseButton);
        const resumeButton = document.createElement("button");
        resumeButton.textContent = "resume";
        resumeButton.addEventListener("click",()=>{
           this.setState("run");
        });
        buttons.appendChild(resumeButton);
        this.element.appendChild(buttons);
        const stopButton = document.createElement("button");
        stopButton.textContent = "stop";
        stopButton.addEventListener("click",()=>{
            this.setState("stop");
        });
        buttons.appendChild(stopButton);
        controls.appendChild(buttons);
        this.element.appendChild(controls);

        target.appendChild(this.element);
    }
    setState(state: timerStates){
        const buttons = this.element.querySelectorAll("button") as NodeListOf<HTMLButtonElement>;
        const buttonState = buttonStates[state];
        buttons.forEach((button, index) => {
            if(!buttonState[index]) button.classList.add("hidden");
            else button.classList.remove("hidden");
        });
    }
    update(time: timeObj | Date, target?: HTMLDivElement): void {
    }

}