import "./styles.css";
import {Clock} from "../../Clock.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {sec2StrTime} from "../../util.ts";
import {DigitType, LEDDigit} from "../LEDTime/LEDDigit/LEDDigit.ts";
import {nullTime} from "../../global.ts";
import {SignalMap} from "../../SignalMap.ts";

export class StopwatchClock extends Clock{
    elapsed = 0;
    lastUpdate = 0;
    isRunning = false;
    timeView?: LEDTime;
    centisecondView: LEDDigit[] = [];
    startButton?: HTMLButtonElement;
    stopButton?: HTMLButtonElement;
    clearButton?: HTMLButtonElement;
    timeSource: SignalMap<Date, number>;
    timeSourceSymbol?: symbol;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<Date, number>) {
        super("stopwatch",parent);
        this.timeSource = timeSource;
        this.render(parent);
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("stopwatch-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.timeView = new LEDTime(timeContainer);
        this.timeView.update(nullTime);
        this.timeView.show();




        const centisecondContainer = document.createElement("div");
        centisecondContainer.classList.add("centiseconds");
        this.centisecondView.push(new LEDDigit(centisecondContainer));
        this.centisecondView.push(new LEDDigit(centisecondContainer));
        this.centisecondView[0].update("0");
        this.centisecondView[0].show();
        this.centisecondView[1].update("0");
        this.centisecondView[1].show();

        timeContainer.appendChild(centisecondContainer);
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
        this.timeSourceSymbol = this.timeSource.subscribe((time)=>{
            this.update(time);
        });
        this.startButton?.classList.add("hidden");
        this.startButton!.innerText = "resume";
        this.stopButton?.classList.remove("hidden");
        this.clearButton?.classList.add("hidden");
    }
    stop(){
        this.isRunning = false;
        if(this.timeSourceSymbol) this.timeSource.unsubscribe(this.timeSourceSymbol);
        this.update(this.timeSource.value!);// Enhance accuracy over 151ms polling
        this.startButton?.classList.remove("hidden");
        this.stopButton?.classList.add("hidden");
        this.clearButton?.classList.remove("hidden");
    }
    clear(){
        this.lastUpdate = this.timeSource.value!;
        this.elapsed = 0;
        this.timeView!.update(nullTime);
        this.centisecondView[0].update("0");
        this.centisecondView[1].update("0");
        this.startButton?.classList.remove("hidden");
        this.startButton!.innerText ="start";
        this.stopButton?.classList.add("hidden");
        this.clearButton?.classList.add("hidden");

    }
    update(time: number): void {
        this.elapsed += (time - this.lastUpdate);
        const timeStrings = sec2StrTime(Math.round(this.elapsed /1000));
        this.timeView?.update(timeStrings);

        const centisecondStr = String(Math.round((this.elapsed % 1000) / 10)).padStart(2,"0");
        this.centisecondView![0].update(centisecondStr[0] as DigitType);
        this.centisecondView![1].update(centisecondStr[1] as DigitType);

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