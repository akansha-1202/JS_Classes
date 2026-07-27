# JavaScript Classes (ES6) — Interview Notes

## Topics
- [What is a Class?](#what-is-a-class)
- [Why Classes Matter](#why-classes-matter)
- [Classes Are Prototypes](#classes-are-prototypes)
- [Classes Are NOT Hoisted](#classes-are-not-hoisted)
- [Two Ways to Define a Class](#two-ways-to-define-a-class)
- [Anatomy of a Class](#anatomy-of-a-class)
- [`constructor` Keyword](#constructor-keyword)
- [`static` Keyword](#static-keyword)
- [Classes Are Always in Strict Mode](#classes-are-always-in-strict-mode)
- [Inheritance & `super`](#inheritance-must-know-for-interviews)
- [Class vs Constructor Function (Quick Compare)](#class-vs-constructor-function-quick-compare)
- [Class vs Function — Interview Core](#class-vs-function-interview-core)
- [Interview Checklist](#interview-checklist)
- [One-Line Summary](#one-line-summary)

<a id="what-is-a-class"></a>
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

<a id="why-classes-matter"></a>
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

<a id="classes-are-prototypes"></a>
## Classes Are Prototypes

A class still creates a **prototype**. Every instance inherits methods from that prototype — they are not copied onto each object.

```js
class Car {
  honk() {
    return "beep";
  }
}

const c1 = new Car();
const c2 = new Car();

c1.honk(); // "beep" — found on Car.prototype
c2.honk(); // "beep" — same shared method

console.log(c1.honk === c2.honk);           // true (one shared function)
console.log(Object.getPrototypeOf(c1) === Car.prototype); // true
```

### Built-in prototype methods also work

Instances sit on the normal prototype chain, so they also get methods from `Object.prototype` (unless you break the chain).

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const u = new User("Alex");

u.toString();                 // ✅ "[object Object]" — from Object.prototype
u.hasOwnProperty("name");     // ✅ true — own property check
"name" in u;                  // ✅ true — own or inherited
Object.keys(u);               // ["name"] — own enumerable keys only
```

| What you get | From where |
|--------------|------------|
| Class methods (`honk`) | `Car.prototype` |
| Built-ins (`toString`, `hasOwnProperty`) | `Object.prototype` (further up the chain) |

**Interview line:** *“A class instance inherits from the class prototype — and through that chain, from `Object.prototype` too.”*

---

<a id="classes-are-not-hoisted"></a>
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

<a id="two-ways-to-define-a-class"></a>
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

<a id="anatomy-of-a-class"></a>
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

<a id="constructor-keyword"></a>
## `constructor` Keyword

`constructor` is a special method. It runs when you create an instance with `new`. Its job: **create + initialize** the object.

### Rules

| Rule | Meaning |
|------|---------|
| Only **one** constructor per class | Two → SyntaxError |
| Optional | If you skip it, JS gives a **default** empty constructor |
| Can take parameters | Set initial property values |
| Can use defaults | Props work even if caller skips some args |

```js
// No constructor → JS provides a default one
class Empty {}
const e = new Empty(); // ✅ works


// One constructor + params + defaults
class Car {
  constructor(doors = 4, color = "black") {
    this.doors = doors;
    this.color = color;
  }
}

const c1 = new Car(2, "red"); // doors: 2, color: "red"
const c2 = new Car();         // doors: 4, color: "black" (defaults)
```

```js
class Bad {
  constructor() {}
  constructor() {} // ❌ SyntaxError — only one allowed
}
```

**Interview line:** *“`constructor` initializes the instance on `new`. One per class; if missing, JS supplies a default.”*

---

<a id="static-keyword"></a>
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

<a id="classes-are-always-in-strict-mode"></a>
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

<a id="inheritance-must-know-for-interviews"></a>
## Inheritance & `super`

`extends` makes a subclass. `super` lets the child call the **parent constructor** or **parent methods** — so you reuse parent logic instead of rewriting it.

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
  constructor(name, breed = "Unknown") {
    super(name);       // MUST run before using `this` — sets inherited props
    this.breed = breed; // subclass-only property
  }

  // own method (plus inherited ones)
  fetch() {
    return `${this.name} fetches the ball`;
  }

  // override + reuse parent via super.method()
  speak() {
    return `${super.speak()} — specifically, barks`;
  }
}

const dog = new Dog("Bruno", "Lab");
dog.speak(); // uses override (+ parent via super)
dog.fetch(); // subclass method
dog.name;    // "Bruno" — inherited via super(name)
dog.breed;   // "Lab" — subclass property

const d2 = new Dog("Max"); // breed defaults to "Unknown"
```

### Subclass constructor rules

| Situation | What happens |
|-----------|--------------|
| Child has **no** constructor | JS default calls `super(...args)` for you |
| Child **declares** a constructor | Must call `super(...)` **before** `this` |
| After `super(...)` | Add subclass-only props / defaults |

```js
// No child constructor → still works; default calls super
class Cat extends Animal {}
const cat = new Cat("Milo");
cat.speak(); // "Milo makes a sound"
```

**Rules to remember:**
1. Child uses `extends Parent`.
2. If child has a `constructor`, call `super(...)` before `this`.
3. After `super`, add subclass-specific properties (and defaults if needed).
4. Subclasses can add their own methods and still use inherited ones.
5. Override a method when needed; use `super.method()` to reuse parent logic.

**Interview line:** *“`extends` inherits. `super()` initializes the parent part. Then the child adds its own props and methods.”*

---

<a id="class-vs-constructor-function-quick-compare"></a>
## Class vs Constructor Function (Quick Compare)

| Topic | Constructor Function | Class |
|--------|----------------------|--------|
| Syntax | Verbose | Clean |
| Inheritance | Manual prototype chain | `extends` / `super` |
| Hoisting | Function declarations hoist | Not hoisted |
| `"use strict"` | Optional | Always strict inside class |
| Methods | Added to `prototype` manually | Auto on prototype |

---

<a id="class-vs-function-interview-core"></a>
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

<a id="interview-checklist"></a>
## Interview Checklist

- [ ] Classes are **syntactic sugar** over prototypes
- [ ] Methods are on the **prototype**, not copied per instance
- [ ] Instances inherit class methods + built-ins like `toString` / `hasOwnProperty`
- [ ] Classes are **not hoisted** (TDZ)
- [ ] Class body is always **strict mode** (no `"use strict"` needed)
- [ ] Functions can be **overwritten**; classes are **extended**, not redeclared
- [ ] Know **declaration** vs **expression**
- [ ] `constructor`, instance props, methods, `static`
- [ ] One `constructor` only; missing → default constructor
- [ ] `static` = class-only utility; not callable on instances
- [ ] `extends` + `super` rules (call `super` before `this`)
- [ ] Subclass can add own props, defaults, and methods
- [ ] Parent prototype updates affect child instances
- [ ] Class = blueprint + methods; Function = simple / stateless work

---

<a id="one-line-summary"></a>
## One-Line Summary

> Classes make prototype-based OOP cleaner. Use a **class** for reusable blueprints with state/methods; use a **function** for simple, stateless work.
