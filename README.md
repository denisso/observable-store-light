# observable-store-light

A **minimal reactive state manager** for projects where you want simple shared state without overhead. 

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

* **useStore: <K extends keyof T>(key: K) => T[K]** 
That subscribes a listener to a specific store key.

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
useStore('count', (_name, _value) => {
  name = _name;
  value = _value;
});

console.log(name, value) // 'count', 1
```

---

## 🔍 Reading and updating values

```ts
const currentCount = store.get('count');

store.set('count', currentCount + 1);

console.log(value) // 2
```

---

## 🗂 Multiple Stores Example

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

