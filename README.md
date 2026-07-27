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

So: declare a class **before** you use it. Call a function **anywhere** — even above its declaration.

```js
// FUNCTION — use first, declare later → works
greet(); // ✅ "hello"

function greet() {
  return "hello";
}


// CLASS — use before declare → error
const p = new Person(); // ❌ ReferenceError
class Person {}


// CLASS — declare first, then use → works
class Person {}
const p = new Person(); // ✅
```

| | Call / `new` before declaration? |
|--|----------------------------------|
| Function declaration | ✅ Works (hoisted) |
| Class declaration | ❌ Throws (not hoisted) |

**Interview trap:** *TDZ (Temporal Dead Zone) applies to classes — like `let` / `const`.*  
**Interview line:** *“Functions can be called anywhere because of hoisting. Classes must appear above any `new` or they throw.”*

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

## `static` Keyword

Use `static` for methods that belong to the **class**, not to each instance.

Call them on the class name. Calling them on an instance throws.

```js
class MathUtil {
  static add(a, b) {
    return a + b; // no `this` instance data needed
  }

  static isEven(n) {
    return n % 2 === 0;
  }
}

MathUtil.add(2, 3);     // ✅ 5  — via class
MathUtil.isEven(4);     // ✅ true

const m = new MathUtil();
m.add(2, 3);            // ❌ TypeError — not on the instance
```

### When to use `static`

| Use `static` when… | Use instance method when… |
|--------------------|---------------------------|
| Logic is a **utility** (no per-object state) | Logic needs `this` / instance data |
| Related to the class itself (helpers, factories) | Behavior differs per object |
| Example: `User.validateEmail(email)` | Example: `user.login()` |

```js
class User {
  constructor(email) {
    this.email = email;
  }

  // instance → needs this user's data
  getEmail() {
    return this.email;
  }

  // static → utility; no specific user required
  static validateEmail(email) {
    return email.includes("@");
  }
}

User.validateEmail("a@b.com"); // ✅ true
const u = new User("a@b.com");
u.getEmail();                  // ✅ "a@b.com"
u.validateEmail("x");          // ❌ TypeError
```

**Interview line:** *“`static` methods live on the class — use them for utilities that don’t need an instance.”*

---

## Classes Are Always in Strict Mode

You do **not** write `"use strict"` inside a class. The class body (constructor + methods) is automatically strict.

That means properties and methods inside the class follow stricter rules than loose (sloppy) mode.

### Why it matters

| Benefit | Meaning |
|---------|---------|
| Catch silent bugs | Mistakes throw errors instead of failing quietly |
| Safer code | Blocks risky patterns (e.g. accidental globals) |
| Future-proof | Bans syntax reserved for upcoming JS versions |

```js
// Outside class (non-strict) — silent bug
function bad() {
  x = 10; // creates global `x` quietly
}

// Inside class — always strict → throws
class Demo {
  setX() {
    x = 10; // ❌ ReferenceError: x is not defined
  }
}
```

Other strict rules that apply inside classes:
- `this` is `undefined` in a method if you call it without an object (not auto-bound to `window`)
- Duplicate parameter names are not allowed
- `with` statement is forbidden
- Deleting undeletable properties throws

**Interview line:** *“Class bodies are strict by default — no `"use strict"` needed, and common silent bugs become real errors.”*

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

## Class vs Function — Interview Core

### Key difference

| | Function | Class |
|--|----------|--------|
| Hoisting | Yes (function declarations) | No (TDZ) |
| Overwrite / redeclare | Yes — later declaration replaces earlier one | No — same-scope redeclare throws |
| Extend | Manual / awkward | Built-in with `extends` |

```js
// Function → hoisted + can be overwritten
sayHi(); // ✅ works (hoisted)

function sayHi() {
  return "hi v1";
}
function sayHi() {
  return "hi v2"; // overwrites previous
}
sayHi(); // "hi v2"


// Class → NOT hoisted + cannot be overwritten
const c = new Car(); // ❌ ReferenceError (not hoisted)

class Car {}
class Car {} // ❌ SyntaxError: already declared

// Class → extend instead of overwrite
class SUV extends Car {} // ✅ reuse + customize
```

**Interview line:** *“Functions can be hoisted and overwritten. Classes cannot — you extend them, you don’t redeclare them.”*

---

### When to use what

| Use a **class** when… | Use a **function** when… |
|------------------------|---------------------------|
| You need a reusable **blueprint** (many similar objects) | One-off / simple logic |
| Object has **state + methods** that work together | Stateless operation (in → out) |
| You need **inheritance** (`extends`) | No shared instance state needed |
| Example: React **class component** + lifecycle methods | Example: React **stateless functional component** |

```js
// CLASS → blueprint with state + methods
class Counter {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count += 1;
    return this.count;
  }
}

const c1 = new Counter();
c1.increment(); // 1


// FUNCTION → simple, stateless operation
function add(a, b) {
  return a + b;
}

add(2, 3); // 5
```

**React mental model (interview-friendly):**
- **Class component** → state, lifecycle, reusable UI blueprint
- **Functional component** → simple UI from props (stateless)  
  *(Modern React prefers functions + hooks; class knowledge still asked in interviews.)*

**Decision rule:**  
Need many objects with shared behavior / inheritance → **class**.  
Need a quick calculation or transform → **function**.

---

## Interview Checklist

- [ ] Classes are **syntactic sugar** over prototypes
- [ ] Methods are on the **prototype**, not copied per instance
- [ ] Classes are **not hoisted** (TDZ)
- [ ] Class body is always **strict mode** (no `"use strict"` needed)
- [ ] Functions can be **overwritten**; classes are **extended**, not redeclared
- [ ] Know **declaration** vs **expression**
- [ ] `constructor`, instance props, methods, `static`
- [ ] `static` = class-only utility; not callable on instances
- [ ] `extends` + `super` rules
- [ ] Parent prototype updates affect child instances
- [ ] Class = blueprint + methods; Function = simple / stateless work

---

## One-Line Summary

> Classes make prototype-based OOP cleaner. Use a **class** for reusable blueprints with state/methods; use a **function** for simple, stateless work.
