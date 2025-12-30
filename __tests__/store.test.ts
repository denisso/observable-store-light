import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../src';

describe('useStore', () => {
  it('updates value with useStore', () => {
    const { useStore } = createStore({ count: 1 });
    const listener = vi.fn<(name: string, value: number) => void>();

    useStore('count', listener);

    expect(listener).toHaveBeenCalledWith('count', 1);
  });

  it('multiple listeners', () => {
    const { useStore } = createStore({ count: 1 });
    let name = '';
    let value = 0;

    useStore('count', (_name, _value) => {
      name = _name;
    });

    useStore('count', (_name, _value) => {
      value = _value;
    });

    expect(name).toBe('count');

    expect(value).toBe(1);
  });

  it('get and set', () => {
    const { useStore, get, set } = createStore({ count: 0 });
    let name = '';
    let value = 0;
    set('count', get('count') + 1);
    useStore('count', (_name, _value) => {
      name = _name;
      value = _value;
    });

    expect(name).toBe('count');

    expect(value).toBe(1);
  });

  it('unmount', () => {
    const { useStore, get, set } = createStore({ count: 0 });
    let name = '';
    let value = 0;
    set('count', get('count') + 1);
    const unmount = useStore('count', (_name, _value) => {
      name = _name;
      value = _value;
    });

    expect(name).toBe('count');

    expect(value).toBe(1);

    unmount()

    set('count', get('count') + 1);
    expect(value).toBe(1);
  });

});
