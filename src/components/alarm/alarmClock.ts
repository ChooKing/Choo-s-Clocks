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
import {Children} from "../Component.ts";
import {Button} from "../button/button.ts";


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
    toggles: Children<Toggle> = {};
    buttons: Children<Button> = {};
    inputs: Children<TimeInput> = {};
    timeViews: Children<LEDTime> = {}
    setting = false;
    enabled = false;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<Date, timeNumObj>) {
        super("alarm", parent);
        this.render(parent);
        this.timeSource = timeSource;
        this.ring = new Ring();
    }
    render(target: HTMLDivElement): void {
        this.element.classList.add("alarm-clock");

        const topControls = document.createElement("div");
        topControls.classList.add("top-controls");
        const h24Toggle = new H24Toggle(topControls, "alarm-24",()=>{
            clockSettings.hr24 = !clockSettings.hr24;
            pmToggle.element.classList.toggle("h24");
            if(this.setting){
                if(!this.isValidTime()){
                    this.buttons.ok.hide();
                }
                else{
                    this.buttons.ok.show();
                }
            }
            else{
                this.showAlarmTime();
            }

        });
        h24Toggle.update(clockSettings.hr24);
        this.toggles.h24 = h24Toggle;

        this.toggles.off = new Toggle(topControls, "alarm-off", () => {
            this.enabled = !this.enabled;
            if(this.enabled) this.enableAlarm();
            else this.disableAlarm();
        }, "off", "on");
        this.element.appendChild(topControls);



        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        const pmToggle = new Toggle(timeContainer, "alarm-pm", ()=>{this.inputs.timeInput.focus()}, "AM", "PM");
        pmToggle.element.classList.add("pm-view");
        if(!clockSettings.hr24 && this.alarmTime.hours >= 12){
            pmToggle.update(true);
        }
        pmToggle.disable();
        this.toggles.pm = pmToggle;

        const timeView = new LEDTime(timeContainer);
        timeView.update(num2StrTimeObj(this.alarmTime, clockSettings.hr24));
        this.timeViews.time = timeView;
        this.inputs.timeInput = new TimeInput(timeContainer, (value: string)=>{
            if(this.setting){
                this.showInputTime(value);
                if(!this.isValidTime()){
                    this.buttons.ok.hide();
                }
                else{
                    console.log("valid")
                    this.buttons.ok.show();
                }
            }
        });
        this.inputs.timeInput.hide();
        this.element.appendChild(timeContainer);

        const buttonControls = document.createElement("div");
        buttonControls.classList.add("controls");

        const setButton = new Button(buttonControls,"set");
        setButton.setHandler(()=>{this.set()});
        this.buttons.set = setButton;
        const okButton = new Button(buttonControls, "ok", true);
        okButton.setHandler(()=>{this.setAlarmTime()});
        this.buttons.ok = okButton;
        this.element.appendChild(buttonControls);
        target.appendChild(this.element);
    }
    set(){
        this.toggles.pm.enable();
        this.inputs.timeInput.setValue("");
        this.setting = true;
        this.inputs.timeInput.show();
        this.redraw(blankTime);
        this.inputs.timeInput.focus();
        this.buttons.set.hide();
    }
    show(){
        super.show();
        this.element.classList.add("visible");
        this.toggles.h24.update(clockSettings.hr24);
        if(clockSettings.hr24){
            this.toggles.pm.element.classList.add("h24");
            this.toggles.pm.element.classList.remove("am");
            this.toggles.pm.element.classList.remove("pm");
        }
        else{
            this.toggles.pm.element.classList.add("am");
            this.toggles.pm.element.classList.remove("pm");
            this.toggles.pm.element.classList.remove("h24");
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
        if(this.toggles.h24.value === "24H") return true;
        const timeStr = this.inputs.timeInput.value? this.inputs.timeInput.value!.padStart(6,"0"):"000000";
        const minutes = Number(timeStr.substring(2,4));
        if(minutes > 59) return false;
        const seconds = Number(timeStr.substring(4,6));
        if(seconds > 59) return false;
        const hours = Number(timeStr.substring(0,2));
        return !(hours > 12 || hours < 1);
    }
    getAlarmInputTime(){
        const timeStr = (this.inputs.timeInput.value !== null)? this.inputs.timeInput.value!.padStart(6, "0"):"000000";
        const hours = hoursTo24(Number(timeStr.substring(0, 2)), this.toggles.h24.value == "24H",((this.toggles.pm as Toggle).value=="PM"));
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
        this.buttons.ok.hide();
        this.buttons.set.show();
        this.enableAlarm();
        this.toggles.pm.disable();
    }
    showAlarmTime(){
        const displayTime = {...this.alarmTime};
        if(!clockSettings.hr24){
            displayTime.hours = !displayTime.hours? 12 : displayTime.hours % 12;
            this.toggles.pm.update(this.alarmTime.hours >= 12);
        }
        this.redraw(num2StrTimeObj(displayTime, clockSettings.hr24));
    }
    enableAlarm(){
        this.timeSource.subscribe(this.name, (value)=>{this.update(value)});
        this.enabled = true;
        this.toggles.off.update(true);
    }
    disableAlarm(){
        this.timeSource.unsubscribe(this.name);
        this.enabled = false;
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
        this.timeViews.time.update(value);
    }
}