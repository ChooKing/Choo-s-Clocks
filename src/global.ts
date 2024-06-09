import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {Clock} from "./Clock.ts";
import {AnalogClock} from "./components/analogClock/analogClock.ts";
import {SignalProvider} from "./SignalProvider.ts";
import {CountdownTimer} from "./components/countdownTimer/countdownTimer.ts";
import {timeObj} from "./util.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type clockNameType = typeof clockNames[number];
export type timeSignalType = Date | timeObj | number;

const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;


export const clockSettings = {
    currentClock: null as Clock<timeSignalType>|null,
    hr24: false,
    time: Date.now(),
    formattedTimeSignal: new SignalProvider<timeObj>(),
    dateTimeSignal: new SignalProvider<Date>(),
    rawTimeSignal: new SignalProvider<number>()
}
export const clocks = {
    digital: new DigitalClock(clockContainer, clockSettings.formattedTimeSignal),
    analog: new AnalogClock(clockContainer, clockSettings.dateTimeSignal),
    countdown: new CountdownTimer(clockContainer, clockSettings.rawTimeSignal)
}
