// @flow

function invariant(x: bool, errorMsg: string) {
  if (!x) {
    throw new Error(errorMsg);
  }
}

class TypeRep<A> {
}

export const NumberRep: TypeRep<number> = new TypeRep();

export const StringRep: TypeRep<string> = new TypeRep();

interface Lens<V, W> {
  $getter(W): V;
  $setter(V => V): (W => W);
}

class Field<V, R: TypeRep<V>, W: {}> implements Lens<V, W>{
  key: string;
  valueRep: R;
  constructor(key: string, valueRep: R) {
    this.key = key;
    this.valueRep = valueRep;
  }
  $getter(whole: W): V {
    return whole[this.key];
  }
  $setter(f: V => V): (W => W) {
    return whole => ({...whole, [this.key]: f(whole[this.key])});
  }
}

type $ExtractRecord<A: {}>  = $ObjMap<A, <V>(TypeRep<V>) => V>;
type $ExtractLenses<A: {}> = $ObjMap<A, <R, V>(TypeRep<V> & R) => Field<V, R, $ExtractRecord<A>>>;

export class RecordRep <A: {}> extends TypeRep<$ExtractRecord<A>> {
  $fields: $ExtractLenses<A>;
  constructor (repMap: A) {
    super();
    this.$fields = {};
    for(const key in repMap) {
      this.$fields[key] = new Field(key, repMap[key]);
    }
  }
}

() => {
  const rec = new RecordRep({
    foo: NumberRep,
    bar: StringRep,
    baz: new RecordRep({
      gab: NumberRep
    })
  });
  (rec.$fields.foo.$getter: * => number);
  (rec.$fields.baz.valueRep.$fields.gab.valueRep: TypeRep<number>);
  // $FlowFixMe
  (rec.$fields.foo.$getter: * => string);
  // $FlowFixMe
  (rec.$fields.baz.valueRep.$fields.gab.valueRep: TypeRep<string>);
}
