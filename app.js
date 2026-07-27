class Car{
    constructor(doors, engine, color){
        this.doors = doors;
        this.engine = engine;
        this.color = color;
    }
    carStats(){
        return `This car has ${this.doors} doors, a ${this.engine} engine and a ${this.color} color`;
    }

    static totalDoors(car1, car2){
        return car1.doors + car2.doors;
    }
}

const cx5 = new Car(5,'V8','Red');
const cz4 = new Car(4, "V6", "Blue");

console.log("cx5 : ", cx5);
console.log("cx5 => carStats : ", cx5.carStats());

console.log("cz4 : ", cz4);
console.log("cz4 => carStats : ", cz4.carStats());

// console.log("Total Doors : ", cx5.totalDoors(4, 5)); //TypeError: cx5.totalDoors is not a function
console.log("Total Doors : ", Car.totalDoors(cx5, cz4)); //9


class SUV extends Car{
    constructor(doors, engine, color, speed, carStats){
        super(doors, engine, color, carStats);
        this._brand = "not set brand yet";
        this.speed = speed;
        this.wheels = 4;
    }

    get getBrand(){
        return this._brand;
    }

    set setBrand(name){
        this._brand = name;
    }

    myBrand(){
        return `This SUV is a ${this._brand}`;
    }
}
const suv = new SUV(5, "V8", "Red", 100);
console.log("suv : ", suv);
console.log("suv => myBrand : ", suv.myBrand());
console.log("suv => carStats : ", suv.carStats());

console.log("--------------------------------");
suv.setBrand = "Toyota";
console.log("suv => getBrand : ", suv.getBrand);
console.log("suv => myBrand : ", suv.myBrand());
