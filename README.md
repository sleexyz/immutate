# immutate

A magical library for ergonomic, type-safe, immutable modifications of javascript objects.

```js
// @flow
import immutate from "immutate";

const state = { foo: { bar: 1 } };

const incrementBar = immutate(state => state.foo.bar)(bar => bar + 1);

const nextState = incrementBar(state);

console.log(state);     // { foo: { bar: 1 } }
console.log(nextState); // { foo: { bar: 2 } }
```



