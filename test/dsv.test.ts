import { expect, test, describe } from "bun:test";
import { parse, stringify } from "../src/dsv.ts";

describe("parse", () => {
  test("splits a plain line on commas", () => {
    expect(parse("a,b,c")).toEqual([["a", "b", "c"]]);
  });

  test("returns one record per line", () => {
    expect(parse("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("keeps empty fields", () => {
    expect(parse("a,,c")).toEqual([["a", "", "c"]]);
  });

  test("honours a custom delimiter", () => {
    expect(parse("a\tb", { delimiter: "\t" })).toEqual([["a", "b"]]);
  });

  test("reads a quoted field containing the delimiter", () => {
    expect(parse('a,"b,c",d')).toEqual([["a", "b,c", "d"]]);
  });

  test("unescapes a doubled quote inside a quoted field", () => {
    expect(parse('"he said ""hi"""')).toEqual([['he said "hi"']]);
  });

  test("maps columns onto the header row", () => {
    expect(parse("name,age\nada,36", { headers: true })).toEqual([{ name: "ada", age: "36" }]);
  });

  test("pads a short record against the header", () => {
    expect(parse("a,b,c\n1,2", { headers: true })).toEqual([{ a: "1", b: "2", c: "" }]);
  });

  test("returns no rows for a header with no records", () => {
    expect(parse("a,b", { headers: true })).toEqual([]);
  });

  test("trims surrounding whitespace from unquoted fields", () => {
    expect(parse("a , b ", { trim: true })).toEqual([["a", "b"]]);
  });

  test("leaves whitespace alone without trim", () => {
    expect(parse("a , b ")).toEqual([["a ", " b "]]);
  });

  test("keeps padding inside a quoted field when trimming", () => {
    expect(parse(' x ,"  b  ", y ', { trim: true })).toEqual([["x", "  b  ", "y"]]);
  });

  test("trims header names as well as records", () => {
    const rows = parse(" name , age \n ada , 36 ", { headers: true, trim: true });
    expect(rows).toEqual([{ name: "ada", age: "36" }]);
    expect((rows[0] as Record<string, string>).name).toBe("ada");
  });
});

describe("stringify", () => {
  test("joins fields and rows", () => {
    expect(
      stringify([
        ["a", "b"],
        ["c", "d"],
      ]),
    ).toBe("a,b\nc,d");
  });

  test("honours a custom delimiter", () => {
    expect(stringify([["a", "b"]], { delimiter: ";" })).toBe("a;b");
  });

  test("round-trips plain data", () => {
    const rows = [
      ["x", "y"],
      ["1", "2"],
    ];
    expect(parse(stringify(rows))).toEqual(rows);
  });
});
