In v2.x, the state change subscription API has been redesigned.

The old API **useStore** returned the unsubscribe function
The new API uses explicit **addListener/removeListener** methods

This change makes the behavior more predictable and familiar to most JS developers.

API v1

```ts
const { useStore, get, set } = createStore({ count: 0 });

let name = '';
let value = 0;

set('count', get('count') + 1);

const unmount = useStore('count', (_name, _value) => {
  name = _name;
  value = _value;
});

console.log(name, value); // 'count', 1

unmount();

set('count', get('count') + 1);
console.log(value); // still 1
```

API v2
```ts
const { addListener, removeListener, get, set } = createStore({ count: 0 });

let name = '';
let value = 0;

const listener = (_name: string, _value: number) => {
  name = _name;
  value = _value;
};

set('count', get('count') + 1);

addListener('count', listener);

console.log(name, value); // 'count', 1

removeListener('count', listener);

set('count', get('count') + 1);
console.log(value); // still 1
```