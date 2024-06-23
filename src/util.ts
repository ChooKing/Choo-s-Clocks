import {DigitType} from "./components/LEDTime/LEDDigit/LEDDigit.ts";

export function date2Time(time: Date, hr24 = false) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return {
        hours: hr24 ? String(hours).padStart(2,"0") : String(hours % 12).padStart(2,"0"),
        minutes:String(minutes).padStart(2,"0"),
        seconds:String(seconds).padStart(2,"0")
    };
}
export const dayNames = ["SUN","MON","TUE","WED","THU","FRI","SAT"] as const;
export type dayNameType = typeof dayNames[number];
export type dateStrObj = {
    month: DigitType[];
    day: DigitType[];
    year: DigitType[];
    dayName: number;
}
export type timeStrObj ={
    hours: DigitType[];
    minutes: DigitType[];
    seconds: DigitType[];
    pm?: boolean;
}
export type timeNumObj = {
    hours: number;
    minutes: number;
    seconds: number;
    millis: number;
}
export function date2DateStrObj(date: Date):dateStrObj{
    if(date){
        const month = String(date.getMonth() + 1).padStart(2,"0");
        const day = String(date.getDate()).padStart(2,"0");
        const year = String(date.getFullYear());
        const dayName = date.getDay();
        return{
            month:[month[0] as DigitType, month[1] as DigitType],
            day:[day[0] as DigitType, day[1] as DigitType],
            year:[year[0] as DigitType, year[1] as DigitType, year[2] as DigitType, year[3] as DigitType],
            dayName}
    }
    return{
        month: ["0", "0"],
        day: ["0", "0"],
        year: ["0", "0","0","0"],
        dayName: 0
    }
}
export function date2NumTime(date: Date):timeNumObj{
    if(date) return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        millis: date.getMilliseconds()
    }
    return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        millis: 0
    }
}
export function sec2StrTime(time: number):timeStrObj{
    const hours = String(Math.floor(time / 3600)).padStart(2,"0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2,"0");
    const seconds = String(time % 60).padStart(2,"0");
    return {
        hours: [hours[0] as DigitType, hours[1] as DigitType],
        minutes: [minutes[0] as DigitType,minutes[1] as DigitType],
        seconds: [seconds[0] as DigitType,seconds[1] as DigitType]
    };
}
export function str2Time(time: string):timeStrObj{
    const paddedTime = time.padStart(6,"0");
    return{
        hours: [paddedTime[0] as DigitType, paddedTime[1] as DigitType],
        minutes: [paddedTime[2] as DigitType, paddedTime[3] as DigitType],
        seconds: [paddedTime[4] as DigitType, paddedTime[5] as DigitType]
    }
}
export function str2Secs(time: string){
    const paddedTime = time.padStart(6, "0");
    const hours = Number(paddedTime.slice(0, 2));
    const minutes = Number(paddedTime.slice(2, 4));
    const seconds = Number(paddedTime.slice(4, 6));
    return hours * 3600 + minutes * 60 + seconds;
}
export function calcHours(hours: number, h24: boolean){
    if(!hours && !h24) return 12;
    if(h24 || hours <= 12) return hours;
    return hours % 12;
}
export function num2StrTimeObj(time: timeNumObj, h24: boolean = true): timeStrObj{
    const hours = String(calcHours(time.hours, h24)).padStart(2,"0");
    const minutes = String(time.minutes).padStart(2,"0");
    const seconds = String(time.seconds).padStart(2,"0");
    return {
        hours: [(!h24 && hours[0]==="0")?" ": hours[0] as DigitType, hours[1] as DigitType],
        minutes: [minutes[0] as DigitType,minutes[1] as DigitType],
        seconds: [seconds[0] as DigitType,seconds[1] as DigitType],
        pm:time.hours >= 12
    }
}