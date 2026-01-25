import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../src';

describe('State', () => {
  it('getState', () => {
    const store = createStore({ count: 1 });
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('setState', () => {
    const state1 = { count: 1 };
    const store = createStore(state1, true);
    const results: number[] = [];
    store.addListener(
      'count',
      (_, value) => {
        results.push(value);
      },
      false,
    );
    const state2 = { count: 2 };
    store.setState(state2);
    expect(store.getState()).toEqual({ count: 2 });
    expect(state1).toEqual({ count: 1 });
    expect(results).toEqual([2]);
    store.set('count', 3);
    expect(results).toEqual([2, 3]);
    expect(store.getState()).toEqual({ count: 3 });
    expect(state2).toEqual({ count: 3 });
  });

  it('isStateActual', () => {
    const state = { count: 1 };
    const store1 = createStore(state, true);
    const store2 = createStore(state);

    store1.set('count', 2);
    expect(store2.isStateActual()).toBe(false);

    store2.setState(state)
    expect(store2.isStateActual()).toBe(true);
  });
});
