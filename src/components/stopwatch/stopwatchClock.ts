import "./styles.css";
import {Clock} from "../../Clock.ts";
import {SignalProvider} from "../../SignalProvider.ts";
import {renderTime, updateTime} from "../LEDTime/LEDTime.ts";
import {sec2Time} from "../../util.ts";
import {DigitType, renderDigit, setDigit} from "../LEDTime/LEDDigit/LEDDigit.ts";

export class StopwatchClock extends Clock<number>{
    elapsed = 0;
    lastUpdate = 0;
    isRunning = false;
    centisecondContainer?: HTMLDivElement;
    startButton?: HTMLButtonElement;
    stopButton?: HTMLButtonElement;
    clearButton?: HTMLButtonElement;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<number>) {
        super("stopwatch",parent, timeSource);
        this.timeSource = timeSource;
        this.render(parent);
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("stopwatch-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        renderTime({hours: ["0","0"], minutes:["0","0"], seconds:["0","0"]}, timeContainer);
        this.centisecondContainer = document.createElement("div");
        this.centisecondContainer.classList.add("centiseconds");
        renderDigit("0", this.centisecondContainer);
        renderDigit("0", this.centisecondContainer);
        timeContainer.appendChild(this.centisecondContainer);
        this.element.appendChild(timeContainer);


        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.startButton = document.createElement("button");
        this.startButton.innerText = "start";
        controls.appendChild(this.startButton);
        this.startButton.addEventListener("click", ()=>{this.start()});


        this.stopButton = document.createElement("button");
        this.stopButton.innerText = "stop";
        controls.appendChild(this.stopButton);
        this.stopButton.addEventListener("click", ()=>{this.stop()});
        this.stopButton.classList.add("hidden");


        this.clearButton = document.createElement("button");
        this.clearButton.innerText = "clear";
        controls.appendChild(this.clearButton);
        this.clearButton.addEventListener("click", ()=>{this.clear()});
        this.clearButton.classList.add("hidden");

        this.element.appendChild(controls);

        target.appendChild(this.element);
    }
    start(){
        this.isRunning = true;
        this.lastUpdate = this.timeSource.value!;
        this.timeSource.subscribe("stopwatch", (time)=>{
            this.update(time);
        });
        this.startButton?.classList.add("hidden");
        this.startButton!.innerText = "resume";
        this.stopButton?.classList.remove("hidden");
        this.clearButton?.classList.add("hidden");
    }
    stop(){
        this.isRunning = false;
        this.timeSource.unsubscribe("stopwatch");
        this.update(this.timeSource.value!);// Enhance accuracy over 151ms polling
        this.startButton?.classList.remove("hidden");
        this.stopButton?.classList.add("hidden");
        this.clearButton?.classList.remove("hidden");
    }
    clear(){
        this.lastUpdate = this.timeSource.value!;
        this.elapsed = 0;
        this.update(this.lastUpdate);
        this.startButton?.classList.remove("hidden");
        this.startButton!.innerText ="start";
        this.stopButton?.classList.add("hidden");
        this.clearButton?.classList.add("hidden");

    }
    update(time: number): void {
        this.elapsed += (time - this.lastUpdate);
        const timeStrings = sec2Time(Math.round(this.elapsed /1000));
        updateTime(timeStrings, this.element.querySelector(".led-time") as HTMLDivElement);
        const centisecondStr = String((this.elapsed % 1000) / 10).padStart(2,"0");
        const centisecondDigits = this.centisecondContainer?.querySelectorAll(".digit");
        setDigit(centisecondStr[0] as DigitType, centisecondDigits![0] as HTMLDivElement);
        setDigit(centisecondStr[1] as DigitType, centisecondDigits![1] as HTMLDivElement);
        this.lastUpdate = time;
    }
    show() {
        super.show();
        this.element.classList.add("visible");
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);
    }
}