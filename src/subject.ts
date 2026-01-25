import type { Listener } from './store';

/**
 * Subject implements a simple observable pattern.
 * It stores a value, allows subscriptions, and notifies observers and listeners
 * when the value changes.
 */
export class Subject<T extends object, K extends keyof T> {
  // Listeners will called when the value is changed
  private listeners: Set<Listener<T[K]>>;
  // name for value in store
  private name: string;
  public value: T[K];
  constructor(name: string, value: T[K]) {
    this.name = name;
    this.listeners = new Set();
    this.value = value;
  }

  addListener(listener: Listener<T[K]>, autoCallListener: boolean = true) {
    this.listeners.add(listener);
    if (autoCallListener) {
      listener(this.name, this.value);
    }
  }

  removeListener(listener: Listener<T[K]>) {
    this.listeners.delete(listener);
  }

  /**
   * Update the value and notify subscribers.
   * @param value - new value
   * @param isRunCallback - do not call listeners if false
   * @returns undefined
   */
  notify(value: T[K]) {
    // Do nothing if the new value is the same as the current one
    if (this.value === value) {
      return;
    }

    this.value = value;

    this.listeners.forEach((listener) => {
      listener(this.name, this.value);
    });
  }
}
