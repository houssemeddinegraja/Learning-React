# React Testing: Vitest and React Testing Library

Notes for The Odin Project's lesson "Introduction To React Testing".

## 1. Why test the UI

Tests that only cover your logic can pass while the screen is broken: the wrong text shows up, or a button does nothing. UI tests check what the user **sees** and can **do**, and warn you when a later change breaks it.

## 2. The tools

| Tool | In plain words |
|------|----------------|
| **Vitest** | The test runner. It finds your tests, runs them and reports pass or fail. Used instead of Jest because the project uses Vite. |
| **React Testing Library (RTL)** | Renders a component for a test and lets you find things on it the way a user would. |
| **jsdom** | A fake browser kept in memory. Nothing appears on screen, so tests are fast. |
| **jest-dom** | Extra checks like `toBeInTheDocument()`. Optional but handy. |
| **user-event** | Simulates typing and clicking. |


## 3. Anatomy of a test: render, find, check

The component:

```jsx
function Nickname() {
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  return isEditing ? (
    <>
      <input value={nickname} onChange={e => setNickname(e.target.value)} />
      <button onClick={() => setIsEditing(false)}>Save</button>
    </>
  ) : (
    <>
      <p>{nickname}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </>
  );
}

export default Nickname;
```

Its test:

```jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nickname from "./Nickname";

describe("Nickname", () => {
  it("shows the saved nickname, then the input again on Edit", async () => {
    const user = userEvent.setup();
    render(<Nickname />);

    await user.type(screen.getByRole("textbox"), "Ali");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Ali")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox")).toHaveValue("Ali");
  });
});
```

- **`describe` / `it`:** group tests and name each one.
- **`render`:** puts the component into jsdom.
- **`screen`:** the toolbox for finding things.
- **`expect`:** states what should be true.
- **`async` / `await`:** user actions take a moment, so the test waits for each one.
- **Fresh render per test:** RTL cleans up after every test, so render again in each one. A small `setup` function avoids repeating it.

## 4. Queries: finding things

| Query | Behavior | Use it for |
|-------|----------|------------|
| `getBy...` | Finds one element, **throws an error if none** | Things that should be there |
| `queryBy...` | Returns `null` if none | Checking something is **absent** |
| `findBy...` | Waits for it to appear (async) | Things that show up later, e.g. after a fetch |

**Priority:** prefer `ByRole`, ideally with a name: `getByRole("button", { name: "Save" })`. It mirrors how people and screen readers find things, so it also keeps the UI accessible. Test ids are the last resort when nothing else fits.

**When nothing matches:** if the button is renamed "Submit" in the component but the test still looks for "Save", the failure happens at the **query**: `getByRole("button", { name: "Save" })` throws before any `expect` runs.

## 5. Checking things

| Check | Use it for |
|-------|------------|
| `toBeInTheDocument()` | The element exists on the page |
| `toHaveTextContent("Save")` | The text inside an element, e.g. a button |
| `toHaveValue("Ali")` | The value of an `input`, `select` or `textarea` (not a button's text) |
| `.textContent` with `toMatch(/regex/i)` | Text compared with a regular expression; `i` ignores case |

## 6. Simulating user events

```jsx
const user = userEvent.setup();
await user.type(input, "Ali");
await user.click(button);
```

- Create the user with `userEvent.setup()` at the start of the test.
- Every `user.` action returns a promise, so `await` it, which makes the test function `async`.

## 7. Snapshots

A snapshot saves the rendered HTML to a file, and later runs compare against it.

- **Pro:** quick to write. One assertion covers a lot.
- **False positives:** it passes while the UI is wrong, as long as nothing changed.
- **False negatives:** it fails on harmless changes (fixing punctuation, swapping a tag), so you stop trusting the tests.

Use snapshots sparingly.

## 8. Quick summary

1. UI tests check what the user sees and does, not the internals.
2. A test has three steps: **render** the component, **find** something, **check** it.
3. Prefer `getByRole` with a name. Use `queryBy` for absence and `findBy` for async.
4. User actions are async, so `await` them.
5. Snapshots are quick but easy to over-trust.
