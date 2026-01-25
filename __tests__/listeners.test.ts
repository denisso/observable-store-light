import { describe, it, expect, vi, } from 'vitest';
import { createStore } from '../src';

describe('Listeners', () => {
  it('multiple listeners', () => {
    const { addListener, set } = createStore({ count: 1, text: '' });
    let count: { name: string; value: number } = {name: "", value: 0};
    let text: { name: string; value: string } = {name: "", value: ""};;

    addListener('count', (name, value) => {
      count = { name, value };
    });

    addListener('text', (name, value) => {
      text = {name, value}
    });

    set("count", 1)
    set("text", "test")
    expect(count).toEqual({name: "count", value: 1});
    expect(text).toEqual({name: "text", value: "test"});
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
});
