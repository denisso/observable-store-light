import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../src';

describe("Listeners", ()=>{
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

    expect(name).toEqual('count');

    expect(value).toEqual(1);
  });
  
  it('removeListener', () => {
    const { addListener, removeListener, get, set } = createStore({ count: 0 });
    let name = '';
    let value = 0;
    set('count', get('count') + 1);
    const listener = (_name: string, _value: number) => {
      name = _name;
      value = _value;
    };
    addListener('count', listener);

    expect(name).toEqual('count');

    expect(value).toEqual(1);

    removeListener('count', listener);

    set('count', get('count') + 1);
    expect(value).toEqual(1);
  });
})