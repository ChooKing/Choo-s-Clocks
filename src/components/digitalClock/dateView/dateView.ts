import "./styles.css";
import {ReactiveComponent} from "../../ReactiveComponent.ts";
import {dateStrObj, dayNames} from "../../../util.ts";
import {Children} from "../../Component.ts";
import {LEDDigit} from "../../LEDTime/LEDDigit/LEDDigit.ts";
import {LEDHyphen} from "../../LEDTime/LEDDigit/LEDHyphen.ts";
import {dateStrSignal} from "../../../global.ts";


export class DateView extends ReactiveComponent<dateStrObj, HTMLDivElement>{
    lastDate: dateStrObj | null = null;
    digits: Children<LEDDigit>={};
    dayNames: HTMLDivElement[]=[];
    constructor(parent: HTMLDivElement) {
        super(parent);
        this.render(parent);
        this.element.classList.add("date-view");
        this.lastDate = {...dateStrSignal.value};
        dateStrSignal.subscribe((value)=>{this.update(value)});
    }
    render(target: HTMLDivElement): void {
        const dateContainer = document.createElement("div");
        dateContainer.classList.add("date-container");
        this.digits.monthA = new LEDDigit(dateContainer);
        this.digits.monthB = new LEDDigit(dateContainer);
        new LEDHyphen(dateContainer);
        this.digits.dayA = new LEDDigit(dateContainer);
        this.digits.dayB = new LEDDigit(dateContainer);
        new LEDHyphen(dateContainer);
        this.digits.yearA = new LEDDigit(dateContainer);
        this.digits.yearB = new LEDDigit(dateContainer);
        this.digits.yearC = new LEDDigit(dateContainer);
        this.digits.yearD = new LEDDigit(dateContainer);
        this.element.appendChild(dateContainer);
        const dayNamesContainer = document.createElement("div");
        dayNamesContainer.classList.add("day-names-container");
        dayNames.forEach(day=>{
           const dayItem = document.createElement("div");
           dayItem.classList.add("day-name");
           dayItem.innerText = day;
           dayNamesContainer.appendChild(dayItem);
           this.dayNames.push(dayItem);
        });
        this.element.appendChild(dayNamesContainer);
        target.appendChild(this.element);
    }

    update(value: dateStrObj): void {
        if (this.lastDate!.day !== value.day) {//Avoid unnecessary updates
            this.digits.monthA.update(value.month[0]);
            this.digits.monthB.update(value.month[1]);
            this.digits.dayA.update(value.day[0]);
            this.digits.dayB.update(value.day[1]);
            this.digits.yearA.update(value.year[0]);
            this.digits.yearB.update(value.year[1]);
            this.digits.yearC.update(value.year[2]);
            this.digits.yearD.update(value.year[3]);
            this.dayNames[this.lastDate!.dayName].classList.remove("lit");
            this.dayNames[value.dayName].classList.add("today");
            this.lastDate = {...value};
        }
    }
}