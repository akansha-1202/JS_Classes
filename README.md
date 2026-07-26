# JavaScript Classes (ES6) — Interview Notes

## What is a Class?

A **class** is cleaner syntax for creating objects and setting up inheritance using prototypes.

Under the hood, classes still use **prototypes**. They do not invent a new inheritance model — they just make the old one easier to write and read.

```js
// Before ES6 (constructor function)
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hi, ${this.name}`;
};

// ES6 class (same idea, cleaner syntax)
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi, ${this.name}`;
  }
}
```

**Interview line:** *“Classes are syntactic sugar over constructor functions and prototypes.”*

---

## Why Classes Matter

| Point | Meaning |
|--------|---------|
| Cleaner syntax | No manual `prototype` wiring for methods |
| Easier inheritance | Use `extends` + `super` |
| Shared methods | Methods live on the prototype, not each instance |
| Live inheritance | If parent prototype changes, child instances see it |

```js
class Animal {
  speak() {
    return "sound";
  }
}

class Dog extends Animal {}

const d = new Dog();
console.log(d.speak()); // "sound"

// Parent change → child instances inherit it
Animal.prototype.speak = function () {
  return "updated sound";
};
console.log(d.speak()); // "updated sound"
```

---

## Classes Are NOT Hoisted

Function declarations are hoisted. **Class declarations are not.**

You must declare a class before you use it.

```js
const p = new Person(); // ❌ ReferenceError
class Person {}
```

```js
class Person {}
const p = new Person(); // ✅ works
```

**Interview trap:** *TDZ (Temporal Dead Zone) applies to classes — like `let` / `const`.*

---

## Two Ways to Define a Class

### 1. Class Declaration (focus of this course)

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

### 2. Class Expression

```js
const User = class {
  constructor(name) {
    this.name = name;
  }
};

// Named class expression
const User = class UserClass {
  constructor(name) {
    this.name = name;
  }
};
```

Both create a class. Declarations are what you’ll use most in interviews and real code.

---

## Anatomy of a Class

```js
class Car {
  // constructor → runs when you call `new Car(...)`
  constructor(brand, speed) {
    this.brand = brand;   // instance property
    this.speed = speed;   // instance property
  }

  // prototype method → shared by all instances
  accelerate() {
    this.speed += 10;
    return this.speed;
  }

  // static method → called on the class, not an instance
  static info() {
    return "Cars move on roads";
  }
}

const c1 = new Car("Toyota", 40);
c1.accelerate();     // ✅ instance method
Car.info();          // ✅ static method
c1.info();           // ❌ TypeError
```

### Key pieces

| Piece | Role |
|--------|------|
| `constructor` | Initializes each new instance |
| Instance properties | Unique per object (`this.x`) |
| Methods | Shared via prototype |
| `static` methods | Belong to the class itself |
| `extends` | Child inherits from parent |
| `super()` | Calls parent constructor / methods |

---

## Inheritance (Must-Know for Interviews)

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // MUST call parent constructor first
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks`; // method override
  }
}

const dog = new Dog("Bruno", "Lab");
dog.speak(); // "Bruno barks"
```

**Rules to remember:**
1. Child uses `extends Parent`.
2. If child has a `constructor`, it **must** call `super(...)` before using `this`.
3. Overriding a method replaces the parent version for that child.
4. Use `super.method()` to reuse parent method logic.

---

## Class vs Constructor Function (Quick Compare)

| Topic | Constructor Function | Class |
|--------|----------------------|--------|
| Syntax | Verbose | Clean |
| Inheritance | Manual prototype chain | `extends` / `super` |
| Hoisting | Function declarations hoist | Not hoisted |
| `"use strict"` | Optional | Always strict inside class |
| Methods | Added to `prototype` manually | Auto on prototype |

---

## Interview Checklist

- [ ] Classes are **syntactic sugar** over prototypes
- [ ] Methods are on the **prototype**, not copied per instance
- [ ] Classes are **not hoisted** (TDZ)
- [ ] Know **declaration** vs **expression**
- [ ] `constructor`, instance props, methods, `static`
- [ ] `extends` + `super` rules
- [ ] Parent prototype updates affect child instances

---

## One-Line Summary

> Classes make prototype-based OOP in JavaScript cleaner — same engine under the hood, better syntax on top.
