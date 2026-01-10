import { Subject } from './subject';
import { error } from './error';

const errorKey = (key: PropertyKey) => {
  let strKey = `typeof ${typeof key}`;
  if (typeof key == 'string' || typeof key == 'number') {
    strKey = String(key);
  }
  error(`There is no key "${strKey}" in the store`);
};

const checkKey = (object: object, key: PropertyKey) => {
  if (object.hasOwnProperty(key)) {
    return;
  }
  errorKey(key);
};

type Store<T extends object> = keyof T extends never
  ? never
  : {
      [K in keyof T]: Subject<T[K]>;
    };

export type Listener<T> = (name: string, value: T) => void;

/**
 * Creates a new isolated store instance.
 * @param initState initial state
 * @returns
 */
export const createStore = <T extends object>(initState: T) => {
  const store = {} as Store<T>;
  Object.keys(initState).forEach((key) => {
    const typedKey = key as keyof T;
    store[typedKey] = new Subject(key, initState[typedKey]) as unknown as Store<T>[keyof T];
  });

  const get = <K extends keyof T>(key: K) => {
    checkKey(store, key);
    return store[key].value as T[K];
  };

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    checkKey(store, key);
    (store[key] as unknown as Subject<T[K]>).notify(value);
  };

  const addListener = <K extends keyof T>(
    key: K,
    listener: Listener<T[K]>,
    autoCallListener: boolean = true,
  ) => {
    checkKey(store, key);
    (store[key] as unknown as Subject<T[K]>).addListener(listener, autoCallListener);
    return () => removeListener(key, listener);
  };

  const removeListener = <K extends keyof T>(key: K, listener: Listener<T[K]>) => {
    checkKey(store, key);
    (store[key] as unknown as Subject<T[K]>).removeListener(listener);
  };

  return {
    get,
    set,
    addListener,
    removeListener,
  };
};
