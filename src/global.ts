import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {AnalogClock} from "./components/analogClock/analogClock.ts";
import {CountdownTimer} from "./components/countdownTimer/countdownTimer.ts";
import {date2DateStrObj, date2NumTime, dateStrObj, num2StrTimeObj, timeNumObj, timeStrObj} from "./util.ts";
import {StopwatchClock} from "./components/stopwatch/stopwatchClock.ts";
import {AlarmClock} from "./components/alarm/alarmClock.ts";
import {SignalMap} from "./SignalMap.ts";
import {DateTimeSignal} from "./dateTimeSignal.ts";
import {Beep} from "./audio/beep.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export const nullTime = {hours: ["0","0"], minutes:["0","0"], seconds:["0","0"]} as timeStrObj;
export const blankTime = {hours: [" "," "], minutes:[" "," "], seconds:[" "," "]} as timeStrObj;


export const clockSettings = {
    hr24: false
}

export const dateTimeSignal = new DateTimeSignal();
const dateNumSignal = new SignalMap<Date, number>(dateTimeSignal, (input: Date)=>{
    if(input) return input.getTime();
    return 0;
});
export const dateStrSignal = new SignalMap<Date, dateStrObj>(dateTimeSignal, (input)=>{
    return date2DateStrObj(input);
});
const timeNumSignal = new SignalMap<Date, timeNumObj>(dateTimeSignal,(input: Date)=>{
    return date2NumTime(input);
});
const formattedTimeSignal =  new SignalMap<timeNumObj, timeStrObj>(timeNumSignal,(input: timeNumObj)=>{
    return num2StrTimeObj(input, clockSettings.hr24);
});
const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
export const clocks = {
    digital: new DigitalClock(clockContainer, formattedTimeSignal),
    analog: new AnalogClock(clockContainer, timeNumSignal),
    countdown: new CountdownTimer(clockContainer, dateNumSignal),
    stopwatch: new StopwatchClock(clockContainer, dateNumSignal),
    alarm: new AlarmClock(clockContainer, timeNumSignal)
}
export type clockNameType = keyof typeof clocks;
export const beep = new Beep();

