import {DigitalClock} from "./components/digitalClock/digitalClock.ts";
import {Clock} from "./Clock.ts";

export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type clockNameType = typeof clockNames[number];
export type clocksType = {[key: string]: Clock};
const clockContainer = document.querySelector('.clock-container') as HTMLDivElement;
export const clocks:clocksType = {
    digital: new DigitalClock(clockContainer)
}

export const clockSettings = {
    currentClock: clocks.digital,
    hr24: false,
    time: Date.now(),
    clockContainer: clockContainer
}
export type timeObj={
    hours: string;
    minutes: string;
    seconds: string;
}