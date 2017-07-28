// @flow

function identitySetter<A>(f: (A => A)): (A => A) {
  return f;
}

class Path {
  path: Array<string>;
  constructor() {
    this.path = [];
  }
  payload(): any {
    if (this.path.length === 0) {
      return undefined;
    }
    const obj = {}
    let view = obj;
    for (let i = 0; i < this.path.length - 1; i += 1) {
      const s = this.path[i];
      view[s] = {};
      view = view[s];
    }
    return obj;
  }
  grow(key: string) {
    this.path.push(key);
  }
}

export default function setter<A: {}, B>(getter: (A => B)): ((B => B) => (A => A)) {
  let path = new Path();
  let s: any = identitySetter;
  while(true) {
    try {
      getter(path.payload());
      break;
    } catch (e) {
      if (e instanceof TypeError) {
        const key = e.message.match(/\'(.*)\'/m)[1];
        const next = f => x => ({ ...x, [key]: f(x[key]) });
        const oldS = s
        s = f => oldS(next(f));
        path.grow(key);
      } else {
        throw e;
      }
    }
  }
  return s;
}
