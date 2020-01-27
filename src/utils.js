/**
 * 
 * @param {string} str 
 * @param {RegExp} regexp 
 */
export const matchAll = (str, regexp) => {
  if (typeof str.matchAll === 'function') {
    return [...str.matchAll(regexp)];
  }
  const arr = [];
  let match = regexp.exec(str);
  while (match !== null) {
    arr.push(match);
    match = regexp.exec(str);
  }
  return arr;
}

export const renderTitle = title => {
  const res = [];
  let i = 0;
  const arr = matchAll(title, /#([^#]+)#/g);
  arr.forEach(t => {
    res.push(title.slice(i, t.index));
    res.push(<b key={t[1]}>{t[1]}</b>)
    i = t.index + t[0].length;
  });
  res.push(title.slice(i));
  return res;
};

const throttleMap = {};
export const throttle = (fn, key, time = 1000) => {
  return (...args) => {
    if (throttleMap[key]) {
      return;
    }
    const res = fn(...args);
    throttleMap[key] = true;
    setTimeout(() => {
      throttleMap[key] = false;
    }, time);
    return res;
  }
};