import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../src';

describe('useStore', () => {
  it('updates value with useStore', () => {
    const { addListener } = createStore({ count: 1 });
    const listener = vi.fn<(name: string, value: number) => void>();

    addListener('count', listener);

    expect(listener).toHaveBeenCalledWith('count', 1);
  });

  it('multiple listeners', () => {
    const { addListener } = createStore({ count: 1 });
    let name = '';
    let value = 0;

    addListener('count', (_name, _value) => {
      name = _name;
    });

    addListener('count', (_name, _value) => {
      value = _value;
    });

    expect(name).toBe('count');

    expect(value).toBe(1);
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

    expect(name).toBe('count');

    expect(value).toBe(1);
  });

  it('multiple props in store', () => {
    const { get, set } = createStore({ count: 0, name: '' });
    set('count', get('count') + 1);
    set('name', 'test');
    expect(get('count')).toBe(1);
    expect(get('name')).toBe('test');
  });

  it('unmount', () => {
    const { addListener, removeListener, get, set } = createStore({ count: 0 });
    let name = '';
    let value = 0;
    set('count', get('count') + 1);
    const listener = (_name: string, _value: number) => {
      name = _name;
      value = _value;
    };
    addListener('count', listener);

    expect(name).toBe('count');

    expect(value).toBe(1);

    removeListener('count', listener);

    set('count', get('count') + 1);
    expect(value).toBe(1);
  });
});
