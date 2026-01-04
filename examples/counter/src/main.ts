import { store } from './store.ts';

const getElement = <T, P extends HTMLElement | null = null>(selector: string, parent?: P): T => {
  let result;
  if (parent) {
    result = parent.querySelector(selector);
  } else {
    result = document.querySelector(selector);
  }

  if (!result) {
    throw Error(`selector: ${selector} not found`);
  }
  return result as T;
};

const templateItem = getElement<HTMLTemplateElement>('#template-item');
const box = getElement<HTMLDivElement>('.items');

const buildItem = () => {
  const elemnt = getElement<HTMLDivElement, HTMLDivElement>(
    '.item',
    templateItem.content.cloneNode(true) as HTMLDivElement,
  );
  box.appendChild(elemnt);
  const text = getElement<HTMLDivElement, HTMLDivElement>('.text', elemnt);

  // ! addListener
  const unmount = store.addListener('count', (name: string, value: number) => {
    text.innerHTML = name + ' = ' + String(value);
  });

  const btnClose = getElement<HTMLDivElement, HTMLDivElement>('.close', elemnt);
  const handlerClose = () => {
    unmount();
    btnClose.removeEventListener('click', handlerClose);
    elemnt.remove();
  };
  btnClose.addEventListener('click', handlerClose);
};

const buildButtonCalc = (selector: string, suffix: string, cb: () => void) => {
  const btn = getElement<HTMLButtonElement>(selector);
  btn.addEventListener('click', cb);
  // ! addListener
  store.addListener('count', (_: string, value: number) => {
    btn.innerHTML = String(value) + suffix;
  });
};
buildButtonCalc('.control .plus', '+1', () => {
  // !  set 
  store.set('count', store.get('count') + 1);
});
buildButtonCalc('.control .minus', '-1', () => {
  // ! get 
  if (store.get('count') > 0) store.set('count', store.get('count') - 1);
});
const btnAdd = getElement<HTMLButtonElement>('.control .add');

btnAdd.addEventListener('click', buildItem);
