export const setSession = (name, val) => {
  let ws = window.sessionStorage;
  let strval = JSON.stringify(val);
  ws.setItem(name, strval);
};

export const getSession = name => {
  let ws = window.sessionStorage;
  let originVal = JSON.parse(JSON.parse(ws.getItem(name)));
  return originVal;
};
