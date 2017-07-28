// @flow
import immutate from "./";

describe("immutate", () => {
  describe("for paths one level deep", () => {
    const modify = immutate(x => x.foo)(x => x + " world");

    it("should set data", () => {
      const data = {
        foo: "hello"
      };
      expect(modify(data)).toEqual({
        foo: "hello world",
      });
    });

    it("should not edit other paths", () => {
      const data = {
        foo: "hello",
        bar: 1
      };
      expect(modify(data)).toEqual({
        foo: "hello world",
        bar: 1
      });
    });
  });

  describe("for paths two levels deep", () => {
    const modify = immutate(x => x.foo.val)(x => x + " world");

    it("should set data", () => {
      const data = {
        foo: {
          val: "hello"
        }
      };
      expect(modify(data)).toEqual({
        foo: {
          val: "hello world",
        }
      });
    });

    it("should not edit other paths", () => {
      const data = {
        foo: {
          val: "hello",
          notval: 2
        },
        bar: 1
      };
      expect(modify(data)).toEqual({
        foo: {
          val: "hello world",
          notval: 2
        },
        bar: 1
      });
    });
  });
});
