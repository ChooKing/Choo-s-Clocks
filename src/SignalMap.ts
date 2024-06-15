import {SignalProvider} from "./SignalProvider.ts";

export class SignalMap<I, O>{
    source: SignalProvider<I>|SignalMap<any, I>;
    callbacks: {name:string, callback: (value:O)=>void}[];
    transform: (input: I)=>O;
    name: string;
    _value!: I;
    constructor(name: string, source: SignalProvider<I>|SignalMap<any, I>, transform: (input: I)=>O) {
        this.name = name;
        this.source = source;
        this.transform = transform;
        this.callbacks = [];
        this.source.subscribe(name, (value: I)=>{
            this._value = value;
            Object.values(this.callbacks).forEach(item=>{
                item.callback(transform(value));
            })
        })
    }
    subscribe(name: string, callback: (value: O) => void){
        this.callbacks.push({name, callback});
    }
    unsubscribe(name: string){
        this.callbacks = this.callbacks.filter(item => item.name !== name);
    }
    get value(){
        return this.transform(this._value);
    }
}