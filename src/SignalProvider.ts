export abstract class SignalProvider<T> {
    //callbacks: {[key: symbol]: (value:T)=>void};
    callbacks: Map<symbol, (value: T) => void> = new Map();
    private _value: T|null;
    constructor() {
        this._value = null;
    }
    setValue(value: T){
        this._value = value;
        this.notify();
    }
    notify(){
        if(this._value !== null) this.callbacks.forEach(callback => callback(this._value!));
        /*
        Object.values(this.callbacks).forEach(item=>{
            item.callback(this._value!);
        })

         */
    }
    subscribe(callback: (value: T) => void){
        const sym = Symbol();
        this.callbacks.set(sym, callback);
        callback(this.value!);
        return sym;
    }
    unsubscribe(sym: symbol){
        //this.callbacks = this.callbacks.filter(item => item.name !== name);
        this.callbacks.delete(sym);
    }
    abstract get value(): T;
}