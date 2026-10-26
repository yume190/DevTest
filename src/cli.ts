#!/usr/bin/env bun
import { parse } from "./dsv.ts";

function usage(): never {
  console.error("usage: dsv [--delimiter <c>] [--headers] [--trim] [file]");
  process.exit(2);
}

const args = process.argv.slice(2);
const options: { delimiter?: string; headers?: boolean; trim?: boolean } = {};
let file: string | undefined;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--delimiter") {
    const next = args[i + 1];
    if (next === undefined) usage();
    options.delimiter = next;
    i += 1;
  } else if (arg === "--headers") {
    options.headers = true;
  } else if (arg === "--trim") {
    options.trim = true;
  } else if (arg === "--help" || arg === "-h") {
    usage();
  } else if (arg !== undefined && !arg.startsWith("-")) {
    file = arg;
  } else {
    usage();
  }
}

const input = file ? await Bun.file(file).text() : await Bun.stdin.text();
console.log(JSON.stringify(parse(input, options), null, 2));
