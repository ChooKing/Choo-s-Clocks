import {Clock} from "../../Clock.ts";
import {clockSettings, timeObj} from "../../global.ts";
function hourAngle(timeData: Date){
    return (timeData.getHours() * 30) + (timeData.getMinutes() * 0.5);
}
function minuteAngle(timeData: Date){
    return (timeData.getMinutes() * 6) + (timeData.getSeconds() * 0.1);
}
function secondsAngle(timeData: Date){
    return (timeData.getMilliseconds() * 0.006) + (timeData.getSeconds() * 6);
}
export type numeralType="arabic"|"roman";
const numerals = {
    arabic: ["12","1","2","3","4","5","6","7","8","9","10","11"],
    roman: ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"]
}
export class AnalogClock extends Clock{
    hourRef: HTMLDivElement;
    minuteRef: HTMLDivElement;
    secondRef: HTMLDivElement;
    constructor(parent: HTMLDivElement) {
        super("analog", parent);
        this.render(parent);
    }
    update(time: Date, target: HTMLDivElement) {
        this.hourRef.style.setProperty("--hour-angle", hourAngle(time) + "deg");
        this.minuteRef.style.setProperty("--minute-angle", minuteAngle(time) + "deg");
        this.secondRef.style.setProperty("--second-angle", secondsAngle(time) + "deg");
    }
    show() {
        super.show();
        clockSettings.rawTimeSignal.subscribe(this.name, (time)=>{
            this.update(time, this.parent);
        });
    }
    hide() {
        super.hide();
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("analog-clock");
        const svgns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgns, "svg");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute('viewbox', '0 0 100 100');
        svg.classList.add("ticks");
        const circle = document.createElementNS(svgns, 'circle');
        circle.setAttributeNS(null, 'cx', "50%");
        circle.setAttributeNS(null, 'cy', "50%");
        circle.setAttributeNS(null, 'r', "48%");
        svg.appendChild(circle);
        this.element.appendChild(svg);
        target.appendChild(this.element);
        const numContainer = document.createElement("div");
        numContainer.classList.add("num-container");
        numerals["arabic"].forEach(numeral=>{
           const group = document.createElement("div");
           group.classList.add("num-group");
           const num = document.createElement("div");
           num.classList.add("num");
           num.innerText = numeral;
           group.appendChild(num);
           numContainer.appendChild(group);
        });
        this.element.appendChild(numContainer);
        this.hourRef = document.createElement("div");
        this.hourRef.classList.add("hour");
        this.hourRef.classList.add("hand");
        this.element.appendChild(this.hourRef);
        this.minuteRef = document.createElement("div");
        this.minuteRef.classList.add("minute");
        this.minuteRef.classList.add("hand");
        this.element.appendChild(this.minuteRef);
        this.secondRef = document.createElement("div");
        this.secondRef.classList.add("second");
        this.secondRef.classList.add("hand");
        this.element.appendChild(this.secondRef);
    }
}