export const renderTitle = title => {
  const res = [];
  let i = 0;
  const arr = title.matchAll(/#([^#]+)#/g);
  for (const t of arr) {
    res.push(title.slice(i, t.index));
    res.push(<b key={t[1]}>{t[1]}</b>)
    i = t.index + t[0].length;
  }
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
    setTimeout(() => throttleMap[key] = false, time);
    return res;
  }
};