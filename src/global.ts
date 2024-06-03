import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {Clock} from "./Clock.ts";
import {AnalogClock} from "./components/analogClock/analogClock.ts";
import {SignalProvider} from "./SignalProvider.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type clockNameType = typeof clockNames[number];
export type clocksType = {[key: string]: Clock};
const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
export const clocks:clocksType = {
    digital: new DigitalClock(clockContainer),
    analog: new AnalogClock(clockContainer)
}

export const clockSettings = {
    currentClock: clocks.digital,
    hr24: false,
    time: Date.now(),
    clockContainer: clockContainer,
    formattedTimeSignal: new SignalProvider<timeObj>(),
    rawTimeSignal: new SignalProvider<Date>()
}
export type timeObj={
    hours: string;
    minutes: string;
    seconds: string;
}