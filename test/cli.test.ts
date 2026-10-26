import { expect, test, describe } from "bun:test";

const cli = new URL("../src/cli.ts", import.meta.url).pathname;

async function run(args: string[], input: string): Promise<string> {
  const proc = Bun.spawn(["bun", "run", cli, ...args], {
    stdin: new TextEncoder().encode(input),
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = await new Response(proc.stdout).text();
  await proc.exited;
  return stdout;
}

describe("cli", () => {
  test("--trim strips surrounding whitespace from unquoted fields", async () => {
    const out = await run(["--trim"], "a , b\n");
    expect(JSON.parse(out)[0]).toEqual(["a", "b"]);
  });

  test("without --trim the whitespace survives", async () => {
    const out = await run([], "a , b\n");
    expect(JSON.parse(out)[0]).toEqual(["a ", " b"]);
  });
});
