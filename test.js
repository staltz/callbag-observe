const test = require('tape');
const observe = require('./index');

test('it observes an async finite listenable source', t => {
  t.plan(6);
  const upwardsExpected = [[0, 'function']];
  const downwardsExpected = [10, 20, 30];

  function makeSource() {
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);
      if (type === 0) {
        const sink = data;
        const id = setInterval(() => {
          if (sent === 0) {
            sent++;
            sink(1, 10);
            return;
          }
          if (sent === 1) {
            sent++;
            sink(1, 20);
            return;
          }
          if (sent === 2) {
            sent++;
            sink(1, 30);
            return;
          }
          if (sent === 3) {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
    return source;
  }

  const source = makeSource();
  observe(x => {
    const e = downwardsExpected.shift();
    t.equals(x, e, 'downwards data is expected: ' + e);
  })(source);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it does not observe a pullable source', t => {
  t.plan(4);
  const upwardsExpected = [
    [0, 'function']
  ];

  function makeSource() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      t.true(upwardsExpected.length > 0, 'source can be pulled');
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);

      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 30);
        return;
      }
    };
    return source;
  }

  const source = makeSource();
  observe(x => {
    t.fail('should not observe anything from a pullable');
  })(source);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 500);
});

