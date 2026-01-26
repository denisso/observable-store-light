import { Subject } from './subject';
import { formatError } from './error';

/**
 * Runtime check that ensures the key exists in the store object.
 * Even though TypeScript restricts keys at compile time,
 * this protects against invalid access at runtime.
 */
const checkKey = (object: object, key: PropertyKey) => {
  if (object.hasOwnProperty(key)) {
    return;
  }
  throw formatError['errorKeyMessage'](key);
};

/**
 * Internal store representation:
 * each property of the state is wrapped into a Subject.
 *
 * If T has no keys, Store<T> becomes never.
 */
type _Store<T extends object> = keyof T extends never
  ? never
  : {
      [K in keyof T]: Subject<T, K>;
    };

/**
 * Listener signature for store updates.
 * Receives the key name and the new value.
 */
export type Listener<T extends object, K extends keyof T> = (name: K, value: T[K]) => void;

/**
 * Creates a new isolated store instance.
 *
 * Each property of the initial state is converted into a Subject,
 * allowing independent subscriptions per key.
 *
 * @param state - Initial store state
 * @param isMutateState - [optional] is mutate state
 * @returns Store API with get/set and subscription methods
 */
export const createStore = <T extends object>(state: T, isMutateState?: boolean) => {
  // Internal store object (key → Subject)
  const store = {} as _Store<T>;
  const keys: (keyof T)[] = Object.keys(state) as (keyof T)[];
  // Initialize a Subject for each key in the initial state
  keys.forEach((key) => {
    store[key] = new Subject<T, keyof T>(key, state[key]) as unknown as _Store<T>[keyof T];
    if (isMutateState) {
      store[key].addListener((_, value) => {
        state[key] = value as T[keyof T];
      }, false);
    }
  });

  class Store {
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
      (store[key] as unknown as Subject<T, K>).notify(value);
    }

    /**
     * return state
     *
     * @returns state
     */
    getState() {
      return state;
    }

    /**
     * Set state
     *
     * @param _state - Initial store state
     * @param _isMutateState - [optional] is mutate state
     */
    setState(_state: T, _isMutateState?: boolean) {
      if (isMutateState !== undefined) {
        isMutateState = _isMutateState;
      }
      state = _state;
      Object.keys(_state).forEach((key) => {
        const typedKey = key as keyof T;
        store[typedKey].notify(_state[typedKey] as any);
      });
    }
    /**
     * Check state relevance
     * 
     * @returns boolean
     */
    isStateActual(): boolean {
      for (const key of keys) {
        if(store[key].value !== state[key]){
          return false
        }
      }
      return true;
    }

    /**
     * Subscribes a listener to changes of a specific key.
     *
     * @param key Store key to subscribe to
     * @param listener Callback invoked on value changes
     * @param autoCallListener [default: false] - Whether to call the listener immediately
     *                         with the current value
     * @returns Unsubscribe function
     */
    addListener<K extends keyof T>(
      key: K,
      listener: Listener<T, K>,
      isAutoCallListener: boolean = false,
    ) {
      checkKey(store, key);
      (store[key] as unknown as Subject<T, K>).addListener(listener, isAutoCallListener);
      return () => this.removeListener(key, listener);
    }

    /**
     * Removes a previously registered listener for a key.
     *
     * @param key Store key to subscribe to
     * @param listener Callback invoked on value changes
     */
    removeListener<K extends keyof T>(key: K, listener: Listener<T, K>) {
      checkKey(store, key);
      (store[key] as unknown as Subject<T, K>).removeListener(listener);
    }
  }

  return new Store();
};

export type Store<T extends object> = ReturnType<typeof createStore<T>>;
