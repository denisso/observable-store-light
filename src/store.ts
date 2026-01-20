import { Subject } from './subject';
import { ErrorWithMessage } from './error';

/**
 * Formats and throws an error for a missing store key.
 * Handles string, number and symbol keys for better diagnostics.
 */
const formatErrorKeyMessage = (key: PropertyKey) => {
  let strKey = `typeof ${typeof key}`;
  if (typeof key == 'string' || typeof key == 'number') {
    strKey = String(key);
  }
  throw ErrorWithMessage(`There is no key "${strKey}" in the store`);
};

/**
 * Runtime check that ensures the key exists in the store object.
 * Even though TypeScript restricts keys at compile time,
 * this protects against invalid access at runtime.
 */
const checkKey = (object: object, key: PropertyKey) => {
  if (object.hasOwnProperty(key)) {
    return;
  }
  throw formatErrorKeyMessage(key);
};

/**
 * Internal store representation:
 * each property of the state is wrapped into a Subject.
 *
 * If T has no keys, Store<T> becomes never.
 */
type Store<T extends object> = keyof T extends never
  ? never
  : {
      [K in keyof T]: Subject<T[K]>;
    };

/**
 * Listener signature for store updates.
 * Receives the key name and the new value.
 */
export type Listener<T> = (name: string, value: T) => void;

/**
 * Creates a new isolated store instance.
 *
 * Each property of the initial state is converted into a Subject,
 * allowing independent subscriptions per key.
 *
 * @param initState Initial store state
 * @returns Store API with get/set and subscription methods
 */
export const createStore = <T extends object>(initState: T) => {
  // Internal store object (key → Subject)
  const store = {} as Store<T>;
  // Initialize a Subject for each key in the initial state
  Object.keys(initState).forEach((key) => {
    const typedKey = key as keyof T;
    store[typedKey] = new Subject(key, initState[typedKey]) as unknown as Store<T>[keyof T];
  });



  class StoreAPi<T> {
    /**
     * Returns the current value for a given key.
     */
    get<K extends keyof T>(key: K) {
      checkKey(store, key);
      return store[key].value as T[K];
    }
    /**
     * Updates the value for a given key
     * and notifies all registered listeners.
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      checkKey(store, key);
      (store[key] as unknown as Subject<T[K]>).notify(value);
    }
    /**
     * Subscribes a listener to changes of a specific key.
     *
     * @param key Store key to subscribe to
     * @param listener Callback invoked on value changes
     * @param autoCallListener Whether to call the listener immediately
     *                         with the current value
     * @returns Unsubscribe function
     */
    addListener<K extends keyof T>(
      key: K,
      listener: Listener<T[K]>,
      autoCallListener: boolean = true,
    ) {
      checkKey(store, key);
      (store[key] as unknown as Subject<T[K]>).addListener(listener, autoCallListener);
      return () => this.removeListener(key, listener);
    }

    /**
     * Removes a previously registered listener for a key.
     *
     * @param key Store key to subscribe to
     * @param listener Callback invoked on value changes
     */
    removeListener<K extends keyof T>(key: K, listener: Listener<T[K]>) {
      checkKey(store, key);
      (store[key] as unknown as Subject<T[K]>).removeListener(listener);
    }
  }

  return new StoreAPi<T>();
};

export type StoreApi<T extends object> = ReturnType<typeof createStore<T>>;
