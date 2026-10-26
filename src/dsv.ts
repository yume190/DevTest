/** A small delimited-value parser: CSV/TSV text in, rows out. */

export type ParseOptions = {
  /** Field separator. Defaults to ",". */
  delimiter?: string;
  /** Treat the first row as column names and return objects. Defaults to false. */
  headers?: boolean;
  /** Strip surrounding whitespace from every unquoted field. Defaults to false. */
  trim?: boolean;
  /** Drop lines that contain no characters. Defaults to true. */
  skipEmptyLines?: boolean;
};

export type Row = string[] | Record<string, string>;

type Resolved = Required<ParseOptions>;

function resolve(options: ParseOptions): Resolved {
  return {
    delimiter: options.delimiter ?? ",",
    headers: options.headers ?? false,
    trim: options.trim ?? false,
    skipEmptyLines: options.skipEmptyLines ?? false,
  };
}

/** Split one line into fields, honouring double-quoted fields and "" escapes. */
function splitLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"' && field === "") {
      quoted = true;
      continue;
    }
    if (line.startsWith(delimiter, i)) {
      fields.push(field);
      field = "";
      i += delimiter.length - 1;
      continue;
    }
    field += ch;
  }
  fields.push(field);
  return fields;
}

export function parse(input: string, options: ParseOptions = {}): Row[] {
  const opts = resolve(options);
  const lines = input.split("\n");

  const records: string[][] = [];
  for (const line of lines) {
    if (opts.skipEmptyLines && line.length === 0) continue;
    records.push(splitLine(line, opts.delimiter));
  }

  if (!opts.headers) return records;

  const header = records.shift();
  if (!header) return [];
  return records.map((record) => {
    const row: Record<string, string> = {};
    header.forEach((name, i) => {
      row[name] = record[i] ?? "";
    });
    return row;
  });
}

export type StringifyOptions = {
  /** Field separator. Defaults to ",". */
  delimiter?: string;
};

export function stringify(rows: string[][], options: StringifyOptions = {}): string {
  const delimiter = options.delimiter ?? ",";
  return rows.map((row) => row.join(delimiter)).join("\n");
}
