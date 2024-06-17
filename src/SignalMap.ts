import {SignalProvider} from "./SignalProvider.ts";
export class SignalMap<I, O> extends SignalProvider<O> {
    transform: (value: I)=>O;
    name: string;
    source: SignalProvider<I>;
    constructor(name: string, source: SignalProvider<I>, transform: (value: I)=>O){
        super();
        this.transform = transform;
        this.name = name;
        this.source = source;
        this.source.subscribe(this.name, (value:I)=>{
            this.setValue(this.transform(value));
        });
    }

    get value(): O {
        return this.transform(this.source.value);
    }
}