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
        const startButton = document.createElement("button");
        startButton.innerText = "start";
        controls.appendChild(startButton);
        startButton.addEventListener("click", ()=>{this.start()});

        this.element.appendChild(controls);

        target.appendChild(this.element);
    }
    start(){
        this.isRunning = true;
        this.lastUpdate = this.timeSource.value!;
        this.timeSource.subscribe("stopwatch", (time)=>{
            this.update(time);
        })
    }
    update(time: number): void {
        if(this.isRunning){
            this.elapsed += (time - this.lastUpdate);
            const timeStrings = sec2Time(Math.round(this.elapsed /1000));
            updateTime(timeStrings, this.element.querySelector(".led-time") as HTMLDivElement);
            const centisecondStr = String((this.elapsed % 1000) / 10).padStart(2,"0");
            const centisecondDigits = this.centisecondContainer?.querySelectorAll(".digit");
            setDigit(centisecondStr[0] as DigitType, centisecondDigits![0] as HTMLDivElement);
            setDigit(centisecondStr[1] as DigitType, centisecondDigits![1] as HTMLDivElement);
            this.lastUpdate = time;
        }
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