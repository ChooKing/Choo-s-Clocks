import {SignalProvider} from "./SignalProvider.ts";

export class DateTimeSignal extends SignalProvider<Date> {
    get value(): Date {
        return new Date();
    }
}