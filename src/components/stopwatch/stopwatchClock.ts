import "./styles.css";
import {Clock} from "../../Clock.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {sec2StrTime} from "../../util.ts";
import {DigitType, LEDDigit} from "../LEDTime/LEDDigit/LEDDigit.ts";
import {nullTime} from "../../global.ts";
import {SignalMap} from "../../SignalMap.ts";
import {Button} from "../button/button.ts";
import {Children} from "../Component.ts";

export class StopwatchClock extends Clock{
    elapsed = 0;
    isRunning = false;
    timeView?: LEDTime;
    centisecondView: LEDDigit[] = [];
    buttons: Children<Button> = {};
    timeSource: SignalMap<Date, number>;
    timeSourceSymbol?: symbol;
    timeOffset = 0;
    startTime = 0;
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
        this.buttons.start = new Button(controls, "start");
        this.buttons.start.setHandler(()=>{this.start();});
        this.buttons.resume = new Button(controls, "resume", true);
        this.buttons.resume.setHandler(()=>{this.resume();});
        this.buttons.stop = new Button(controls, "stop", true);
        this.buttons.stop.setHandler(()=>{this.stop();});
        this.buttons.clear = new Button(controls, "clear", true);
        this.buttons.clear.setHandler(()=>{this.clear()});
        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    start(){
        this.run();
        this.buttons.start.hide();
    }
    resume(){
        this.timeOffset = this.elapsed;
        this.run();
    }
    run(){
        this.isRunning = true;
        this.startTime = this.timeSource.value;
        this.timeSourceSymbol = this.timeSource.subscribe((time)=>{
            this.update(time);
        });
        this.buttons.stop.show();
        this.buttons.resume.hide();
        this.buttons.clear.hide();
    }
    stop(){
        this.isRunning = false;
        if(this.timeSourceSymbol) this.timeSource.unsubscribe(this.timeSourceSymbol);
        this.update(this.timeSource.value!);// Enhance accuracy over 151ms polling
        this.buttons.resume.show();
        this.buttons.stop.hide();
        this.buttons.clear.show();
    }
    clear(){
        this.startTime = 0;
        this.elapsed = 0;
        this.timeView!.update(nullTime);
        this.centisecondView[0].update("0");
        this.centisecondView[1].update("0");
        this.buttons.start.show();
        this.buttons.stop.hide();
        this.buttons.clear.hide();
        this.buttons.resume.hide();
    }
    update(time: number): void {
        this.elapsed = (time - this.startTime + this.timeOffset);
        const timeStrings = sec2StrTime(Math.round(this.elapsed /1000));
        this.timeView?.update(timeStrings);

        const centisecondStr = String(Math.round((this.elapsed % 1000) / 10)).padStart(2,"0");
        this.centisecondView![0].update(centisecondStr[0] as DigitType);
        this.centisecondView![1].update(centisecondStr[1] as DigitType);
    }
    show() {
        super.show();
        this.element.classList.add("visible");
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);
    }

    sleep(): void {

    }

    wake(): void {

    }
}