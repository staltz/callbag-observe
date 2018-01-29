# callbag-observe

Callbag listener sink that gets data from any listenable source. Think of it as "observable.subscribe".

`npm install callbag-observe`

## example

```js
const interval = require('callbag-interval');
const observe = require('callbag-observe');

const source = interval(1000);

observe(x => console.log(x))(source); // 0
                                      // 1
                                      // 2
                                      // 3
                                      // ...
```

