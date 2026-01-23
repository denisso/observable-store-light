import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../src';

describe('Store', () => {
  it('updates value on init', () => {
    const { addListener } = createStore({ count: 1 });
    const listener = vi.fn<(name: string, value: number) => void>();

    addListener('count', listener);

    expect(listener).toHaveBeenCalledWith('count', 1);
  });

  it('get and set', () => {
    const { addListener, get, set } = createStore({ count: 0 });
    let name = '';
    let value = 0;
    set('count', get('count') + 1);
    addListener('count', (_name: string, _value: number) => {
      name = _name;
      value = _value;
    });

    expect(name).toEqual('count');

    expect(value).toEqual(1);
  });

  it('multiple props in store', () => {
    const { get, set } = createStore({ count: 0, name: '' });
    set('count', get('count') + 1);
    set('name', 'test');
    expect(get('count')).toEqual(1);
    expect(get('name')).toEqual('test');
  });

  it('mutate initial state', () => {
    const state1 = { count: 0, name: '' };
    const state2 = { count: 0, name: '' };
    const store1 = createStore(state1);
    const store2 = createStore(state2, true);
    for (const store of [store1, store2]) {
      store.set('count', store.get('count') + 1);
      store.set('name', 'test');
    }
    expect(state1).toEqual({ count: 0, name: '' });
    expect(state2).toEqual({ count: 1, name: 'test' });
  });
});
