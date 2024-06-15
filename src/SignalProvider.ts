export class SignalProvider<T> {
    callbacks: {name:string, callback: (value:T)=>void}[];
    private _value: T|null;
    constructor() {
        this.callbacks = [];
        this._value = null;
    }
    setValue(value: T){
        this._value = value;
        this.notify();
    }
    notify(){
        Object.values(this.callbacks).forEach(item=>{
            item.callback(this._value!);
        })
    }
    subscribe(name: string, callback: (value: T) => void){
        this.callbacks.push({name, callback});
        callback(this.value!);
    }
    unsubscribe(name: string){
        this.callbacks = this.callbacks.filter(item => item.name !== name);
    }
    get value(){
        return this._value;
    }
}