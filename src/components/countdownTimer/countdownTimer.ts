import "./styles.css";
import {Clock} from "../../Clock.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {sec2Time, str2Time, timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";
import {TimeInput} from "../Input/timeInput.ts";
import {nullTime} from "../../global.ts";
const buttonStates = {
    //set, start, pause, resume, stop
    set:[false, true, false,false,false],
    stop: [true, false, false,false,false],
    run:[false, false, true,false, true],
    pause:[false, false, false,true,true]
}
type timerStates = keyof typeof buttonStates | "start" | "resume";
export class CountdownTimer extends Clock<number>{
    duration: number;
    elapsed: number;
    lastUpdate: number;
    timerState: timerStates;
    timeView!: LEDTime;
    input!: TimeInput;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<number>) {
        super("countdown", parent, timeSource);
        this.render(parent);
        this.duration = 0;
        this.elapsed = 0;
        this.lastUpdate = 0;
        this.timerState = "stop";
        this.setState("stop");
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
        sandFalling.classList.add("hidden");
        glassLower.appendChild(sandFalling);
        hourglass.appendChild(glassLower);
        const capBottom = document.createElement("div");
        capBottom.classList.add("cap");
        hourglass.appendChild(capBottom);
        this.element.appendChild(hourglass);


        const controls = document.createElement("div");
        controls.classList.add("controls");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.timeView = new LEDTime(timeContainer);
        this.timeView.update(nullTime);
        this.timeView.show();
        this.input = new TimeInput(timeContainer,(value: string)=>{this.showSetTime(str2Time(value))});




        controls.appendChild(timeContainer);

        //BUTTONS
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        const setButton = document.createElement("button");
        setButton.textContent = "set";
        setButton.addEventListener("click",()=>{
            this.input.reset();
            this.timeView.update(nullTime);
            this.input.show();
            this.input.element.focus();
            this.setState("set");

        });
        buttons.appendChild(setButton);
        const startButton = document.createElement("button");
        startButton.textContent = "start";
        startButton.addEventListener("click",()=>{
            this.setState("start");
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
           this.setState("resume");
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
        if(state === "start"){
            this.duration = this.input.time *1000;
            console.log(this.duration);
            this.lastUpdate = this.timeSource.value ?? Date.now();
            this.timeSource.subscribe(this.name,(time)=>{
                this.update(time);
            });
            state = "run";
            this.elapsed = 0;
        }
        else if(state === "pause"){
            this.timeSource.unsubscribe(this.name);
        }
        else if(state === "stop"){
            this.timeSource.unsubscribe(this.name);
            this.duration = 0;
            this.element.style.setProperty("--percent-remaining", "0%");
            this.timeView.update(nullTime);
        }
        else if(state === "resume"){
            this.lastUpdate = this.timeSource.value ?? Date.now();
            this.timeSource.subscribe(this.name,(time)=>{
                this.update(time);
            });
            state = "run";
        }
        const sandFalling = this.element.querySelector(".sand-falling") as HTMLDivElement;
        if(state === "run"){
            sandFalling.classList.remove("hidden");
        }
        else{
            sandFalling.classList.add("hidden");
        }
        const buttons = this.element.querySelectorAll("button") as NodeListOf<HTMLButtonElement>;
        const buttonState = buttonStates[state];
        buttons.forEach((button, index) => {
            if(!buttonState[index]) button.classList.add("hidden");
            else button.classList.remove("hidden");
        });
        this.timerState = state;
    }
    showSetTime(value: timeObj){
        this.timeView.update(value);
    }
    update(time: number): void {
        if(this.timerState === "run"){
            this.elapsed += time - this.lastUpdate;
            const timeRemaining = this.duration - this.elapsed;
            const percentRemaining = (timeRemaining / this.duration) * 100;
            this.element.style.setProperty("--percent-remaining", percentRemaining+"%");
            const remainingObj = sec2Time(Math.round(timeRemaining / 1000));
            this.timeView.update(remainingObj);
            if(this.elapsed >= this.duration){
                this.setState("stop");
                console.log("finished");
            }
        }
        this.lastUpdate = time;
    }

}