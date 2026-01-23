const messages = {
  errorKeyMessage: (key: PropertyKey) => {
    let strKey = `typeof ${typeof key}`;
    if (typeof key == 'string' || typeof key == 'number') {
      strKey = String(key);
    }
    return `There is no key "${strKey}" in the store`
  },

};

type MessageFn = (...args: any[]) => string;
type MessageMap = Record<string, MessageFn>;
type ToErrorMap<T extends MessageMap> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => Error;
};

const patch = <T extends MessageMap>(obj: T): ToErrorMap<T> => {
  const out = {} as ToErrorMap<T>;

  for (const key in obj) {
    const fn = obj[key];

    out[key] = ((...args: Parameters<typeof fn>) =>
      new Error('observable-store-light: ' + fn(...args))) as ToErrorMap<T>[typeof key];
  }

  return out;
};

export const formatError = patch(messages);
