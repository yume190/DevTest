# dsv

A small delimited-value parser: CSV/TSV text in, rows out.

```sh
bun run src/cli.ts --headers data.csv
echo 'a,b' | bun run src/cli.ts
```

## API

```ts
import { parse, stringify } from "./src/dsv.ts";

parse("a,b\nc,d");                        // [["a","b"],["c","d"]]
parse("name,age\nada,36", { headers: true }); // [{ name: "ada", age: "36" }]
stringify([["a", "b"]]);                  // "a,b"
```

### `parse(input, options?)`

| Option | Default | Meaning |
| --- | --- | --- |
| `delimiter` | `","` | Field separator. |
| `headers` | `false` | Use the first row as column names and return objects. |
| `trim` | `false` | Strip surrounding whitespace from every unquoted field. |
| `skipEmptyLines` | `true` | Drop lines that contain no characters. |

A field may be wrapped in double quotes to carry the delimiter or a line break.
A doubled quote inside a quoted field is one literal quote.

A record shorter than the header is padded with empty strings.

### `stringify(rows, options?)`

| Option | Default | Meaning |
| --- | --- | --- |
| `delimiter` | `","` | Field separator. |

`stringify` is the inverse of `parse`: for any rows, `parse(stringify(rows))`
returns the same rows.

## Line endings

Input may use LF or CRLF. Both produce the same rows; the carriage return is
not part of any field.

## Develop

```sh
bun install
bun test
bun run typecheck
```
