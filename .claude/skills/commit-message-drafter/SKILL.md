---
name: commit-message-drafter
description: Drafts a proper, conventional commit message by looking at the actual staged/unstaged changes — never runs the commit itself, only proposes the message for the user to review and commit manually. Use whenever the user asks to write, draft, suggest, or help with a commit message, asks "what should my commit message be," is about to commit a feature/fix/refactor, or says things like "commit this" or "write a commit for this" — but always stop at drafting the message, never execute `git commit`.
---

# Commit Message Drafter

Draft a clean, conventional commit message based on what actually changed — never guess from memory, and never run the commit yourself. This skill only produces text for the user to review and commit with on their own terms.

## Step 1: Look at the real changes

Always inspect the actual diff before writing anything — never draft a message from the user's verbal description alone if the real change is available to inspect.

```bash
git status
git diff --staged      # what will actually be committed, if anything is staged
git diff                # unstaged changes, if nothing is staged yet
```

- If nothing is staged, work from the unstaged diff, but tell the user you're doing so (they may want to `git add` selectively first, which changes what the message should describe).
- If the diff spans clearly unrelated changes (e.g. a new feature AND an unrelated bug fix in other files), flag this to the user — that's usually a sign the changes should be split into two commits, and one commit message can't honestly describe both.
- Read enough of the actual diff to understand *why* the change was made, not just which lines moved — a good commit message explains intent, not just "changed file.js."

## Step 2: Determine the commit type

Use [Conventional Commits](https://www.conventionalcommits.org/) format: `type(scope): summary`

| Type | When to use it |
|---|---|
| `feat` | A new feature or capability was added |
| `fix` | A bug was fixed |
| `refactor` | Code restructured with no behavior change |
| `perf` | A performance improvement |
| `docs` | Documentation only (README, comments, etc.) |
| `style` | Formatting only — no logic change (whitespace, semicolons) |
| `test` | Adding or fixing tests, no production code change |
| `chore` | Tooling, dependencies, config, build scripts — no app logic |
| `revert` | Reverting a previous commit |

If the diff touches multiple types (e.g. a feature plus its tests), the primary type is whichever represents the *main intent* of the change — mention the secondary aspect in the body, not the type prefix.

**Scope** (the part in parentheses) is optional but encouraged when it's clear — e.g. `feat(auth)`, `fix(tasks)`, `feat(dashboard)`. Base it on the folder/module most of the diff touches. Skip it if the change is genuinely cross-cutting.

## Step 3: Write the message

Structure:

```
type(scope): short summary in imperative mood, no period, under ~60 chars

Optional body (max 2 lines): the one thing a reviewer needs to know —
why, not what. Wrap around 72 chars. Skip it if the summary says enough.
```

The whole message — summary plus body — should fit in **3 lines or fewer**. If there's a footer (`BREAKING CHANGE:`, `Closes #123`), it replaces rather than adds to the body lines.

Rules for the summary line:
- **Imperative mood** — "add," "fix," "remove," not "added," "fixes," "removes." Test: it should complete the sentence "If applied, this commit will ___."
- No period at the end of the summary line.
- Specific, not vague — "fix(tasks): prevent duplicate submission on double-click" beats "fix bug."

Rules for the body:
- Keep the whole message short and sweet — **max 3 lines total** (summary line + at most 2 body lines). No multi-paragraph explanations, no bullet lists of every file touched.
- Only include a body if the summary line alone doesn't capture the important context. A one-line config tweak doesn't need one; a bug fix with a non-obvious root cause does.
- Explain the *reasoning* — what problem existed, why this approach was chosen — not just a restatement of what the diff shows. Pick the single most important thing a reviewer needs to know, not everything.
- If the change fixes a bug, briefly state what the bug was and its impact, not just the fix.

## Step 4: Present it — do not commit

Show the drafted message clearly, e.g.:

```
Here's a commit message for these changes:

---
feat(tasks): add priority field with three-tier sorting

Task list now sorts by priority within each date group, so urgent
items surface without needing a separate filter.
---

Want me to adjust anything, or is this good to use?
```

- **Never run `git commit` yourself**, even if asked to "just commit it" — this skill's entire purpose is to hand back a message, not to execute the commit. If the user explicitly asks you to also run the commit, remind them this skill only drafts messages and that committing is theirs to do (or a separate explicit action they'd need to request outside this skill's scope).
- If the diff was ambiguous or spans unrelated changes (see Step 1), lead with that observation before offering a draft, and suggest splitting into multiple commits with a separate message for each.
- If asked for alternatives, offer 2–3 short variations rather than one rigid answer, especially for the summary line — commit message style is a little personal, and the user should pick the phrasing that fits their voice.
