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

interface _Lens<V, W> {
  $getter(W): V;
  $setter(V => V): (W => W);
}

type Lens<V, W> = {
  $getter(W): V;
  $setter(V => V): (W => W);
}

class Field<V, R: TypeRep<V>, W: {}> implements _Lens<V, W>{
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
type $ExtractLensesOld<A: {}> = $ObjMap<A, <R, V>(TypeRep<V> & R) => Field<V, R, $ExtractRecord<A>>>;

class RecordRepOld <A: {}> extends TypeRep<$ExtractRecord<A>> {
  $fields: $ExtractLensesOld<A>;
  constructor (repMap: A) {
    super();
    this.$fields = {};
    for(const key in repMap) {
      this.$fields[key] = new Field(key, repMap[key]);
    }
  }
}

() => {
  const rec = new RecordRepOld({
    foo: NumberRep,
    bar: StringRep,
    baz: new RecordRepOld({
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

// take 2

function giveLens<V, R: TypeRep<V>, W: {}>(key: string, field: R): Lens<V, W> & R {
  const _field: any = field;
  _field.$getter = (x: W): V => {
    return x[key];
  }
  _field.$setter = (f: V => V): (W => W) => {
    return x => ({...x, [key]: f(x[key])});
  }
  return _field;
}


type $ExtractLenses<A: {}> = $ObjMap<A, <R, V>(TypeRep<V> & R) => Lens<V, $ExtractRecord<A>> & R>;

export function RecordRep <A: {}> (repMap: A): TypeRep<$ExtractRecord<A>> & $ExtractLenses<A> {
  const fields: any = new TypeRep();
  for(const key in repMap) {
    fields[key] = giveLens(key, repMap[key]);
  }
  return fields;
}

() => {
  const schema = RecordRep({
    foo: NumberRep,
    bar: StringRep,
    baz: RecordRep({
      gab: NumberRep
    })
  });
  (schema.foo.$getter: * => number);
  (schema.baz.gab: TypeRep<number>);
  (schema.baz.gab.$getter: { gab: number } => number);
  // $FlowFixMe
  (schema.foo.$getter: * => string);
  // $FlowFixMe
  (schema.baz.gab.$getter: { gab: string } => number);
  // $FlowFixMe
  (schema.baz.gab.$getter: { gab: number } => string);
  // $FlowFixMe
  (schema.baz.gab.$getter: { gab: string } => string);
  // $FlowFixMe
  (schema.baz.gab: TypeRep<string>);
}

// take 2

/* function giveLens<V, R: TypeRep<V>, W: {}>(key: string, field: R): Lens<V, W> & R {
 *   const _field: any = field;
 *   _field.$getter = (x: W): V => {
 *     return x[key];
 *   }
 *   _field.$setter = (f: V => V): (W => W) => {
 *     return x => ({...x, [key]: f(x[key])});
 *   }
 *   return _field;
 * }
 *
 *
 * type $ExtractLenses<A: {}> = $ObjMap<A, <R, V>(TypeRep<V> & R) => Lens<V, $ExtractRecord<A>> & R>;
 *
 * export function RecordRep <A: {}> (repMap: A): TypeRep<$ExtractRecord<A>> & $ExtractLenses<A> {
 *   const fields: any = new TypeRep();
 *   for(const key in repMap) {
 *     fields[key] = giveLens(key, repMap[key]);
 *   }
 *   return fields;
 * }
 *
 * () => {
 *   const schema = RecordRep({
 *     foo: NumberRep,
 *     bar: StringRep,
 *     baz: RecordRep({
 *       gab: NumberRep
 *     })
 *   });*/
  /* (schema[A].bar[B]: { foo: number, bar: string, baz: { gab: number } } => string);*/
  /* (schema[A].baz.gab[B]: { foo: number, bar: number, baz: { gab: number } } => number);*/
  /* (schema[A].baz[B]: { foo: number, bar: number, baz: { gab: number } } => { gab: number });*/
/* }*/
