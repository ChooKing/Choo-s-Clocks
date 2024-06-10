import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {AnalogClock} from "./components/analogClock/analogClock.ts";
import {SignalProvider} from "./SignalProvider.ts";
import {CountdownTimer} from "./components/countdownTimer/countdownTimer.ts";
import {timeObj} from "./util.ts";
import {StopwatchClock} from "./components/stopwatch/stopwatchClock.ts";
import {AlarmClock} from "./components/alarm/alarmClock.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type timeSignalType = Date | timeObj | number;
export const nullTime = {hours: ["0","0"], minutes:["0","0"], seconds:["0","0"]} as timeObj;
export const blankTime = {hours: [" "," "], minutes:[" "," "], seconds:[" "," "]} as timeObj;
const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
export const signals = {
    formattedTimeSignal: new SignalProvider<timeObj>(),
    dateTimeSignal: new SignalProvider<Date>(),
    rawTimeSignal: new SignalProvider<number>()
}

export const clocks = {
    digital: new DigitalClock(clockContainer, signals.formattedTimeSignal),
    analog: new AnalogClock(clockContainer, signals.dateTimeSignal),
    countdown: new CountdownTimer(clockContainer, signals.rawTimeSignal),
    stopwatch: new StopwatchClock(clockContainer, signals.rawTimeSignal),
    alarm: new AlarmClock(clockContainer, signals.formattedTimeSignal)
}
export type clockNameType = keyof typeof clocks;
export const clockSettings = {
    currentClock: null as clockNameType|null,
    hr24: false
}

