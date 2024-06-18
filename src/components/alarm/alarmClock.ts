import "./styles.css";
import {Clock} from "../../Clock.ts";
import {num2StrTimeObj, timeNumObj, timeStrObj} from "../../util.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {blankTime, clockSettings} from "../../global.ts";
import {TimeInput} from "../Input/timeInput.ts";
import {SignalMap} from "../../SignalMap.ts";
import {Toggle} from "../Input/toggle/toggle.ts";
import {H24Toggle} from "../Input/h24toggle.ts";
import {DigitType} from "../LEDTime/LEDDigit/LEDDigit.ts";
import {Ring} from "../../audio/ring.ts";

function hoursTo24(hours: number, h24: boolean, pm: boolean){
    if(h24) return hours;
    return pm? hours + 12 : hours;
}

export class AlarmClock extends Clock{
    timeSource: SignalMap<Date, timeNumObj>;
    alarmTime = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        millis: 0
    } as timeNumObj;
    ring: Ring;
    setting = false;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<Date, timeNumObj>) {
        super("alarm", parent);
        this.render(parent);
        this.timeSource = timeSource;
        this.ring = new Ring();
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("alarm-clock");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        const pmToggle = new Toggle(timeContainer, "alarm-pm", ()=>{(this.children.input as TimeInput).focus()}, "AM", "PM");
        pmToggle.show();
        pmToggle.element.classList.add("pm-view");
        if(!clockSettings.hr24 && this.alarmTime.hours >= 12){
            pmToggle.update(true);
        }
        pmToggle.disable();
        this.children.pmToggle = pmToggle;

        const timeView = new LEDTime(timeContainer);
        timeView.update(num2StrTimeObj(this.alarmTime, clockSettings.hr24));
        timeView.show();
        this.children.timeView = timeView;
        this.children.input = new TimeInput(timeContainer, (value: string)=>{
            if(this.setting){
                this.showInputTime(value);
                (this.children.okButton as HTMLButtonElement).disabled = !this.isValidTime();
            }
        });
        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        const h24Toggle = new H24Toggle(controls, "alarm-24",()=>{
            clockSettings.hr24 = !clockSettings.hr24;
            pmToggle.element.classList.toggle("h24");
            if(this.setting){
                (this.children.okButton as HTMLButtonElement).disabled = !this.isValidTime();
            }
            else{
                this.showAlarmTime();
            }

        });
        h24Toggle.update(clockSettings.hr24);
        h24Toggle.show();
        this.children.h24Toggle = h24Toggle;

        const setButton = document.createElement("button");
        setButton.innerText = "set";
        controls.appendChild(setButton);
        setButton.addEventListener("click", ()=>{this.set()});
        this.children.setButton = setButton;
        const okButton = document.createElement("button");
        okButton.innerText = "OK";
        okButton.disabled = true;
        controls.appendChild(okButton);
        okButton.addEventListener("click", ()=>{this.setAlarmTime()});
        this.children.okButton = okButton;
        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    set(){
        (this.children.pmToggle as Toggle).enable();
        (this.children.input as TimeInput).setValue("");
        this.setting = true;
        (this.children.input as TimeInput).show();
        this.redraw(blankTime);
        (this.children.input as TimeInput).focus();
        (this.children.okButton as HTMLButtonElement).classList.remove("fading");
        (this.children.setButton as HTMLButtonElement).classList.add("fading");
    }
    show(){
        super.show();
        this.element.classList.add("visible");
        (this.children.h24Toggle as H24Toggle).update(clockSettings.hr24);
        if(clockSettings.hr24){
            (this.children.pmToggle as Toggle).element.classList.add("h24");
            (this.children.pmToggle as Toggle).element.classList.remove("am");
            (this.children.pmToggle as Toggle).element.classList.remove("pm");
        }
        else{
            (this.children.pmToggle as Toggle).element.classList.add("am");
            (this.children.pmToggle as Toggle).element.classList.remove("pm");
            (this.children.pmToggle as Toggle).element.classList.remove("h24");
        }
    }
    hide(){
        super.hide();
        setTimeout(()=>{this.element.classList.remove("visible");}, 500);

    }
    showInputTime(value: string){
        const inputStr = value.padStart(6, " ");
        const time:timeStrObj = {
            hours: [inputStr[0] as DigitType, inputStr[1] as DigitType],
            minutes: [inputStr[2] as DigitType, inputStr[3] as DigitType],
            seconds: [inputStr[4] as DigitType, inputStr[5] as DigitType]
        };
        this.redraw(time);
    }

    isValidTime(){
        if((this.children.h24Toggle as H24Toggle).value === "24H") return true;
        const timeStr = (this.children.input as TimeInput).value? (this.children.input as TimeInput).value!.padStart(6,"0"):"000000";
        const minutes = Number(timeStr.substring(2,4));
        if(minutes > 59) return false;
        const seconds = Number(timeStr.substring(4,6));
        if(seconds > 59) return false;
        const hours = Number(timeStr.substring(0,2));
        return !(hours > 12 || hours < 1);
    }
    getAlarmInputTime(){
        const timeStr = ((this.children.input as TimeInput).value !== null)? (this.children.input as TimeInput).value!.padStart(6, "0"):"000000";
        const hours = hoursTo24(Number(timeStr.substring(0, 2)), (this.children.h24Toggle as H24Toggle).value == "24H",((this.children.pmToggle as Toggle).value=="PM"));
        const minutes = Number(timeStr.substring(2, 4));
        const seconds = Number(timeStr.substring(4, 6));
        const time:timeNumObj = {
            hours, minutes, seconds, millis: 0
        };
        return time;
    }
    setAlarmTime(){
        this.alarmTime = this.getAlarmInputTime();
        this.showAlarmTime();
        this.setting = false;
        (this.children.okButton as HTMLButtonElement).disabled = true;
        (this.children.okButton as HTMLButtonElement).classList.add("fading");
        (this.children.setButton as HTMLButtonElement).classList.remove("fading");
        this.enableAlarm();
        (this.children.pmToggle as Toggle).disable();
    }
    showAlarmTime(){
        const displayTime = {...this.alarmTime};
        if(!clockSettings.hr24){
            displayTime.hours = !displayTime.hours? 12 : displayTime.hours % 12;
            (this.children.pmToggle as Toggle).update(this.alarmTime.hours >= 12);
        }
        this.redraw(num2StrTimeObj(displayTime, clockSettings.hr24));
    }
    enableAlarm(){
        this.timeSource.subscribe(this.name, (value)=>{this.update(value)});
    }
    update(value: timeNumObj): void {
        if(
            (value.hours === this.alarmTime.hours) &&
            (value.minutes === this.alarmTime.minutes) &&
            (value.seconds === this.alarmTime.seconds)
        ){
            console.log("alarm time reached");
            this.ring.play();
            this.timeSource.unsubscribe(this.name);
        }
    }
    redraw(value: timeStrObj): void {
        (this.children.timeView as LEDTime).update(value);
    }
}