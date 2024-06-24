import {SignalProvider} from "./SignalProvider.ts";
export class SignalMap<I, O> extends SignalProvider<O> {
    transform: (value: I)=>O;
    source: SignalProvider<I>;
    sourceSymbol: symbol;
    constructor(source: SignalProvider<I>, transform: (value: I)=>O){
        super();
        this.transform = transform;
        this.source = source;
        this.sourceSymbol = this.source.subscribe((value:I)=>{
            this.setValue(this.transform(value));
        });
    }

    get value(): O {
        return this.transform(this.source.value);
    }
}