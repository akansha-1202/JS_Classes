class Car{
    constructor(doors, engine, color){
        this.doors = doors;
        this.engine = engine;
        this.color = color;
    }
    carStats(){
        return `This car has ${this.doors} doors, a ${this.engine} engine and a ${this.color} color`;
    }
}

const cx5 = new Car(4,'V8','Red');

console.log("cx5 : ", cx5);
console.log("cx5 => carStats : ", cx5.carStats());