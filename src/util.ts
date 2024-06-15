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
export type timeStrObj ={
    hours: DigitType[];
    minutes: DigitType[];
    seconds: DigitType[];
}
export type timeNumObj = {
    hours: number;
    minutes: number;
    seconds: number;
    millis: number;
}
export function date2NumTime(date: Date):timeNumObj{
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        millis: date.getMilliseconds()
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
export function num2StrTimeObj(time: timeNumObj): timeStrObj{
    const hours = String(time.hours).padStart(2,"0");
    const minutes = String(time.minutes).padStart(2,"0");
    const seconds = String(time.seconds).padStart(2,"0");
    return {
        hours: [hours[0] as DigitType, hours[1] as DigitType],
        minutes: [minutes[0] as DigitType,minutes[1] as DigitType],
        seconds: [seconds[0] as DigitType,seconds[1] as DigitType]
    }
}