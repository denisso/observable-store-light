> ⚠️ Version 2.x introduces breaking changes compared to 1.x  
> See MIGRATION_v1_to_v2.md for details.

# observable-store-light

A **minimal reactive state manager** for projects where you want simple shared state without overhead. 

[CDN](https://www.jsdelivr.com/package/npm/observable-store-light)
```
<script src="https://cdn.jsdelivr.net/npm/observable-store-light@1.0.1/dist/index.min.js"></script>
```

---

## Features

* **Observer-based state updates**
  Components automatically re-render when a subscribed value changes.

* **Zero dependencies**
  Nothing extra in your bundle.

* **Fully typed with TypeScript**
  Strong typing for keys and values out of the box.

* **Can be used from JavaScript projects**
  TypeScript is optional — works perfectly in JS ESM modules or single module CommonJS.

* **Supports multiple independent stores**
  Create as many stores as you need — each one is fully isolated.

* **State flexibility**
  Does **not** enforce state serialization.

  You can store **any JavaScript values** in the store:
  - primitives
  - objects and arrays
  - class instances
  - functions
  - DOM references
  - non-serializable values
  
* **Tiny bundle size**

---

## Installation

```bash
npm install observable-store-light
```

or

```bash
pnpm add observable-store-light
```

---

## API

* **createStore: <T extends object>(initData: T)** 
Creates a new isolated store instance.

* **addListener: <K extends keyof T>(key: K) => T[K]** 
Attach listener to a specific store key.

* **removeListener: <K extends keyof T>(key: K) => T[K]** 
Attach listener to a specific store key.

* **get: <K extends keyof T>(key: K) => T[K]** 
Reads the value by key.

* **set: <K extends keyof T>(key: K, value: T[K], isCallListener?: boolean = true) => void** 
Updates a value by key and calls listeners optional.

---

## Quick Start

Create store 

```ts
import { createStore } from "observable-store-light";

const store = createStore({
  count: 1,
});
```

### Using the store 

Attach listener

```tsx
let name = '';
let value = 0;
addListener('count', (_name, _value) => {
  name = _name;
  value = _value;
});

console.log(name, value) // 'count', 1
```

---

## Reading and updating values

```ts
const currentCount = store.get('count');

store.set('count', currentCount + 1);

console.log(value) // 2
```

---

## Multiple Stores Example

```ts
const authStore = createStore({
  isAuthenticated: false,
});

const settingsStore = createStore({
  theme: "dark",
});
```

Each store is completely independent and has its own state and subscriptions.

---

## License

MIT

---

## Author

**Denis Kurochkin**

