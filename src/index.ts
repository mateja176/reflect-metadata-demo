/* eslint-disable @typescript-eslint/ban-types */

import 'reflect-metadata';

const methodsMap = new Map<Function, string[]>();

const Saga = () => {
  return (target: object, methodKey: string) => {
    const methods = methodsMap.get(target.constructor);

    if (methods) {
      methods.push(methodKey);

      return;
    }

    methodsMap.set(target.constructor, [methodKey]);
  };
};

const ParamTypes = () => {
  return (target: object, methodKey: string) => {
    console.debug(
      Reflect.getMetadata('design:paramtypes', target, methodKey)?.map(
        ({ name }: Function) => {
          console.log(name);
        },
      ),
    );
  };
};

class Name {
  constructor(public value: string) {}
  toString() {
    return this.value;
  }
}
class Greeting {
  @Saga()
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  hello(name: Name, punctuation: string = '!') {
    return `Hello ${name}${punctuation}`;
  }
  @ParamTypes()
  hola(name: Name | string) {
    return `Hola ${name}`;
  }
}

const greeting = new Greeting();
const helloMetadata = Reflect.getMetadata(
  'design:paramtypes',
  greeting,
  'hello',
);
const holaMetadata = Reflect.getMetadata('design:paramtypes', greeting, 'hola');

console.debug(helloMetadata);
console.debug(holaMetadata);
