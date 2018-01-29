const observe = operation => source => {
  source(0, (t, d) => {
    if (t === 1) operation(d);
  });
}

module.exports = observe;
