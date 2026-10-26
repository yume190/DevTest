# Repository Instructions

## Change delivery

Any behaviour change goes on its own branch and is delivered as a pull request.
Never push to `main`.

Cut the branch from the current `main` before the first edit. The pull request
names the issue it settles with a closing keyword — `Closes #12` — so merging it
closes the issue. Work that only investigates uses `Refs #12` instead.

## Issues

Every issue carries both English and 繁體中文, in that order, separated by a
`---` line. Both halves say the same thing: the same problem, the same proposed
direction, the same acceptance criteria. A reader of either language gets the
whole issue, never a summary of the other half. Code, identifiers, paths and
commands are not translated.

An issue states what is observably wrong, the direction a fix would take, and
the acceptance criteria that decide when it is done.

- The problem statement names the file and symbol it is about.
- An acceptance criterion names behaviour that can be run, not the shape of the
  code that produces it.
- Each criterion also says how it fails: what breaks when the change is removed.

## Pull requests

A pull request body carries, in this order:

- **Summary** — what changed, in bullets.
- **What changed** — why the change is shaped this way.
- **Verification** — the commands that were run and their real output.
- A closing keyword for the issue.

Verification must include a negative control: evidence that the check fails
without the change. A test that only compares output against a recorded
snapshot is not acceptable on its own — the behaviour has to be observable at
runtime.

## Checks

```sh
bun run typecheck
bun test
```

Both must pass before a pull request is opened.
