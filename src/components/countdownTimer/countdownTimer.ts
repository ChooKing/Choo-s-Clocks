import "./styles.css";
import {Clock} from "../../Clock.ts";
import {LEDTime} from "../LEDTime/LEDTime.ts";
import {sec2StrTime, str2Time, timeStrObj} from "../../util.ts";
import {TimeInput} from "../Input/timeInput.ts";
import {beep, blankTime, nullTime} from "../../global.ts";
import {SignalMap} from "../../SignalMap.ts";
import {Children} from "../Component.ts";
import {Button} from "../button/button.ts";
import {LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";
import {Dialog} from "@capacitor/dialog";
const buttonStates = {
    //set, start, pause, resume, stop
    set:[false, true, false,false,false],
    stop: [true, false, false,false,false],
    run:[false, false, true,false, true],
    pause:[false, false, false,true,true]
}
type timerStates = keyof typeof buttonStates | "start" | "resume";
export class CountdownTimer extends Clock{
    duration: number;
    startTime = 0;
    remaining = 0;
    timerState: timerStates;
    timeView!: LEDTime;
    input!: TimeInput;
    buttons: Children<Button> = {};
    timeSource: SignalMap<Date, number>;
    timeSourceSymbol?: symbol;
    timeOffset = 0;
    notification?: LocalNotificationSchema;
    constructor(parent: HTMLDivElement, timeSource: SignalMap<Date, number>) {
        super("countdown", parent);
        this.timeSource = timeSource;
        this.render(parent);
        this.duration = 0;
        this.timerState = "stop";
        this.setState("stop");
    }

    render(target: HTMLDivElement): void {
        this.element.classList.add("countdown-clock");
        const hourglass = document.createElement("div");
        hourglass.classList.add("hourglass");
        const capTop = document.createElement("div");
        capTop.classList.add("cap");
        hourglass.appendChild(capTop);
        const glassUpper = document.createElement("div");
        glassUpper.classList.add("glass");
        const sandUpper = document.createElement("div");
        sandUpper.classList.add("sand");
        glassUpper.appendChild(sandUpper);
        hourglass.appendChild(glassUpper);
        const glassLower = document.createElement("div");
        glassLower.classList.add("glass");
        const landedViewport = document.createElement("div");
        landedViewport.classList.add("landed-viewport");
        const landedSand = document.createElement("div");
        landedSand.classList.add("landed");
        landedSand.classList.add("sand");
        landedViewport.appendChild(landedSand);
        glassLower.appendChild(landedViewport);
        const sandFalling = document.createElement("div");
        sandFalling.classList.add("sand-falling");
        sandFalling.classList.add("hidden");
        glassLower.appendChild(sandFalling);
        hourglass.appendChild(glassLower);
        const capBottom = document.createElement("div");
        capBottom.classList.add("cap");
        hourglass.appendChild(capBottom);
        this.element.appendChild(hourglass);


        const controls = document.createElement("div");
        controls.classList.add("controls");
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");
        this.timeView = new LEDTime(timeContainer);
        this.timeView.update(nullTime);
        this.timeView.show();
        this.input = new TimeInput(timeContainer,(value: string)=>{
            this.showSetTime(str2Time(value));
            if(Number(value) > 0){
                this.buttons.start.enable();
            }
            else this.buttons.start.disable();
        });
        this.input.hide();
        controls.appendChild(timeContainer);

        //BUTTONS
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");
        this.buttons.set = new Button(buttons, "set");
        this.buttons.set.setHandler(()=>{
            this.setState("set");
        });
        this.buttons.start = new Button(buttons, "start", true);
        this.buttons.start.setHandler(()=>{
            this.setState("start");
        });
        this.buttons.pause = new Button(buttons, "pause", true);
        this.buttons.pause.setHandler(()=>{
            this.setState("pause");
        });
        this.buttons.resume = new Button(buttons, "resume", true);
        this.buttons.resume.setHandler(()=>{
            this.setState("resume");
        });
        this.buttons.stop = new Button(buttons, "stop", true);
        this.buttons.stop.setHandler(()=>{
            this.setState("stop");
        });
        this.element.appendChild(buttons);
        controls.appendChild(buttons);
        this.element.appendChild(controls);
        target.appendChild(this.element);
    }
    setState(state: timerStates){
        if(state==="set"){
            this.input.reset();
            this.timeView.update(blankTime);
            this.input.show();
            this.input.element.focus();
            this.buttons.start.disable();
        }
        else if(state === "start"){
            this.duration = this.input.time *1000;
            this.remaining = this.duration;
            this.startTime = this.timeSource.value;
            this.timeSourceSymbol = this.timeSource.subscribe((time)=>{
                this.update(time);
            });
            state = "run";
            this.input.hide();
            this.input.element.value = "";
            this.setAlarm();
        }
        else if(state === "pause"){
            this.timeOffset = this.duration - this.remaining;
            if(this.timeSourceSymbol) this.timeSource.unsubscribe(this.timeSourceSymbol);
        }
        else if(state === "stop"){
            if(this.timeSourceSymbol) this.timeSource.unsubscribe(this.timeSourceSymbol);
            this.duration = 0;
            this.element.style.setProperty("--percent-remaining", "0%");
            this.timeView.update(nullTime);
            this.timeOffset = 0;
            if(this.notification) LocalNotifications.cancel({notifications: [this.notification]});
        }
        else if(state === "resume"){
            this.startTime = this.timeSource.value;
            this.timeSourceSymbol = this.timeSource.subscribe((time)=>{
                this.update(time);
            });
            state = "run";
        }
        const sandFalling = this.element.querySelector(".sand-falling") as HTMLDivElement;
        if(state === "run"){
            sandFalling.classList.remove("hidden");
        }
        else{
            sandFalling.classList.add("hidden");
        }
        const buttonState = buttonStates[state];
        Object.values(this.buttons).forEach((button, index)=>{
            if(!buttonState[index]) button.hide();
            else button.show();
        })
        this.timerState = state;
    }
    setAlarm(){
        const alarmDate = new Date();
        alarmDate.setSeconds(alarmDate.getSeconds() + (this.remaining)/1000);
        const notification = {
            title: "Countdown Timer",
            schedule: {at: alarmDate, repeats: false},
            body: "Time ended",
            id: 2,
            sound: "ring.mp3"
        };
        this.notification = notification;
        LocalNotifications.checkPermissions().then(()=>{
            LocalNotifications.schedule({
                notifications: [notification]
            });
        });


    }
    showSetTime(value: timeStrObj){
        this.timeView.update(value);
    }
    update(time: number): void {
        if(this.timerState === "run"){
            this.remaining = this.duration - (time - this.startTime) - this.timeOffset;
            const percentRemaining = (this.remaining / this.duration) * 100;
            this.element.style.setProperty("--percent-remaining", percentRemaining+"%");
            const remainingObj = sec2StrTime(Math.round(this.remaining / 1000));
            this.timeView.update(remainingObj);
            if(this.remaining <= 0){
                if(this.timeSourceSymbol) this.timeSource.unsubscribe(this.timeSourceSymbol);
                this.parent.classList.add("ringing");
                setTimeout(()=>{
                    this.parent.classList.remove("ringing");
                }, 2000);
                this.setState("stop");
                Dialog.alert({
                    title: 'Countdown',
                    message: 'Countdown finished',
                });

                beep.play(200);
                setTimeout(()=>{
                    beep.play(500);
                }, 300);
                console.log("finished");



            }
        }
    }

}