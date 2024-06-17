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
    setButton! : HTMLButtonElement;
    okButton!: HTMLButtonElement;
    timeView!: LEDTime;
    input!: TimeInput;
    h24Toggle!: Toggle;
    pmToggle!: Toggle;
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
        this.pmToggle = new Toggle(timeContainer, "alarm-pm", ()=>{this.input.focus()}, "AM", "PM");
        this.pmToggle.show();
        this.pmToggle.element.classList.add("pm-view");
        if(!clockSettings.hr24 && this.alarmTime.hours >= 12){
            this.pmToggle.update(true);
        }
        this.pmToggle.disable();

        this.timeView = new LEDTime(timeContainer);
        this.timeView.update(num2StrTimeObj(this.alarmTime, clockSettings.hr24));

        this.timeView.show();
        this.input = new TimeInput(timeContainer, (value: string)=>{
            if(this.setting){
                this.showInputTime(value);
                this.okButton.disabled = !this.isValidTime();
            }
        });
        this.element.appendChild(timeContainer);

        const controls = document.createElement("div");
        controls.classList.add("controls");
        this.h24Toggle = new H24Toggle(controls, "alarm-24",()=>{
            clockSettings.hr24 = !clockSettings.hr24;
            this.pmToggle.element.classList.toggle("h24");
            if(this.setting){
                this.okButton.disabled = !this.isValidTime();
            }
            else{
                this.showAlarmTime();
            }

        });
        this.h24Toggle.update(clockSettings.hr24);
        this.h24Toggle.show();

        this.setButton = document.createElement("button");
        this.setButton.innerText = "set";
        controls.appendChild(this.setButton);
        this.setButton.addEventListener("click", ()=>{this.set()});

        this.okButton = document.createElement("button");
        this.okButton.innerText = "OK";
        this.okButton.disabled = true;
        controls.appendChild(this.okButton);
        this.okButton.addEventListener("click", ()=>{this.setAlarmTime()});

        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    set(){
        this.pmToggle.enable();
        this.input.setValue("");
        this.setting = true;
        this.input.show();
        this.timeView?.update(blankTime);
        this.input.focus();
        this.okButton.classList.remove("fading");
        this.setButton.classList.add("fading");
    }
    show(){
        super.show();
        this.element.classList.add("visible");
        this.h24Toggle.update(clockSettings.hr24);
        if(clockSettings.hr24){
            this.pmToggle.element.classList.add("h24");
            this.pmToggle.element.classList.remove("am");
            this.pmToggle.element.classList.remove("pm");
        }
        else{
            this.pmToggle.element.classList.add("am");
            this.pmToggle.element.classList.remove("pm");
            this.pmToggle.element.classList.remove("h24");
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
        }
        this.timeView.update(time);
    }

    isValidTime(){
        if(this.h24Toggle.value === "24H") return true;
        const timeStr = this.input.value? this.input.value.padStart(6,"0"):"000000";
        const hours = Number(timeStr.substring(0,2));
        return !(hours > 12 || hours < 1);
    }
    getAlarmInputTime(){
        const timeStr = (this.input.value !== null)? this.input.value.padStart(6, "0"):"000000";
        const hours = hoursTo24(Number(timeStr.substring(0, 2)), this.h24Toggle.value == "24H",(this.pmToggle.value=="PM"));
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
        this.okButton.disabled = true;
        this.okButton.classList.add("fading");
        this.setButton.classList.remove("fading");
        this.enableAlarm();
        this.pmToggle.disable();
    }
    showAlarmTime(){
        const displayTime = {...this.alarmTime};
        if(!clockSettings.hr24){
            displayTime.hours = !displayTime.hours? 12 : displayTime.hours % 12;
            this.pmToggle.update(this.alarmTime.hours >= 12);
        }
        this.timeView.update(num2StrTimeObj(displayTime, clockSettings.hr24));
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

}