import "./styles.css";
import {Clock} from "../../Clock.ts";
import {timeObj} from "../../util.ts";
import {SignalProvider} from "../../SignalProvider.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {blankTime} from "../../global.ts";

export class AlarmClock extends Clock<timeObj>{
    setButton? : HTMLButtonElement;
    timeView?: LEDTime;
    constructor(parent: HTMLDivElement, timeSource: SignalProvider<timeObj>) {
        super("alarm", parent, timeSource);
        this.render(parent);
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("alarm-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.timeView = new LEDTime(timeContainer);
        this.timeView.update({hours: ["1","2"], minutes:["0","0"], seconds:["0","0"]});
        this.timeView.show();

        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.setButton = document.createElement("button");
        this.setButton.innerText = "set";
        controls.appendChild(this.setButton);
        this.setButton.addEventListener("click", ()=>{this.set()});
        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    set(){
        this.timeView?.update(blankTime);
    }
    show(){
        super.show();
        this.element.classList.add("visible");
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);

    }
    update(value: timeObj): void {
        console.log(value);
    }

}