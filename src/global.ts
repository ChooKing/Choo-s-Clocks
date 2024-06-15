import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {AnalogClock} from "./components/analogClock/analogClock.ts";
import {SignalProvider} from "./SignalProvider.ts";
import {CountdownTimer} from "./components/countdownTimer/countdownTimer.ts";
import {date2NumTime, num2StrTimeObj, timeNumObj, timeStrObj} from "./util.ts";
import {StopwatchClock} from "./components/stopwatch/stopwatchClock.ts";
import {AlarmClock} from "./components/alarm/alarmClock.ts";
import {SignalMap} from "./SignalMap.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type timeSignalType = Date | timeStrObj | number;
export const nullTime = {hours: ["0","0"], minutes:["0","0"], seconds:["0","0"]} as timeStrObj;
export const blankTime = {hours: [" "," "], minutes:[" "," "], seconds:[" "," "]} as timeStrObj;


export const clockSettings = {
    hr24: false
}




export const dateTimeSignal = new SignalProvider<Date>();
const dateNumSignal = new SignalMap<Date, number>("date-num", dateTimeSignal, (input: Date)=>input.getTime());
const timeNumSignal = new SignalMap<Date, timeNumObj>("raw-time",dateTimeSignal,(input: Date)=>{
    return date2NumTime(input);
});
const formattedTimeSignal =  new SignalMap<timeNumObj, timeStrObj>("timeObj24", timeNumSignal,(input: timeNumObj)=>{
    return num2StrTimeObj(input, clockSettings.hr24);
});
const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
export const clocks = {
    digital: new DigitalClock(clockContainer, formattedTimeSignal),
    analog: new AnalogClock(clockContainer, timeNumSignal),
    countdown: new CountdownTimer(clockContainer, dateNumSignal),
    stopwatch: new StopwatchClock(clockContainer, dateNumSignal),
    alarm: new AlarmClock(clockContainer, formattedTimeSignal)
}
export type clockNameType = keyof typeof clocks;

