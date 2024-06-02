export const clockNames = ["digital", "analog","countdown", "stopwatch", "alarm"] as const;
export type clockNameType = typeof clockNames[number];
export const clockSettings = {
    currentClock: "digital" as clockNameType,
    hr24: false,
    time: Date.now(),
    clockContainer: document.querySelector('.clock-container') as HTMLDivElement
}
export type timeObj={
    hours: string;
    minutes: string;
    seconds: string;
}