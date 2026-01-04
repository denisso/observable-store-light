import type { Listener } from './store';

/**
 * Subject implements a simple observable pattern.
 * It stores a value, allows subscriptions, and notifies observers and listeners
 * when the value changes.
 */
export class Subject<T> {
  // Listeners will called when the value is changed
  private listeners: Set<Listener<T>>;
  // name for value in store
  private name: string;
  public value: T;
  constructor(name: string, value: T) {
    this.name = name;
    this.listeners = new Set();
    this.value = value;
  }

  addListener(listener: Listener<T>) {
    this.listeners.add(listener);
    listener(this.name, this.value);
  }

  removeListener(listener: Listener<T>) {
    this.listeners.delete(listener);
  }

  /**
   * Update the value and notify subscribers.
   * @param value - new value
   * @param isRunCallback - do not call listeners if false
   * @returns undefined
   */
  notify(value: T) {
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
