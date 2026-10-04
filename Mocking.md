# Mocking Callbacks and Components

Notes for The Odin Project's lesson "Mocking Callbacks And Components".

## 1. What is mocking?

**Mocking** means replacing a real piece (a function, a child component) with a simple fake, so a test checks one thing without depending on everything around it.

- **Mocking a callback:** the component receives a function (like `onClick`) from its parent. You don't know or care what that function does. You only care that the component **calls it at the right time**.
- **Mocking a child component:** in a big component tree, tests get convoluted. Swapping a child for a bare-bones fake lets you test the parent alone. The lesson says this is rare, but worth knowing about.

## 2. Testing a callback: `CustomButton`

The component:

```jsx
// CustomButton.jsx

const CustomButton = ({ onClick }) => {
  // a component that receives a function called onClick from its parent
  return (
    <button onClick={onClick}>Click me</button>
    // a button that runs that function when it's clicked
  );
};

export default CustomButton;
// makes it importable from other files
```

Its test, with every line explained:

```jsx
// CustomButton.test.jsx

import { vi, describe, it, expect } from 'vitest'
// the test tools: vi (for fake functions), describe (to group tests), it (to write one test), expect (to say what should be true)

import { render, screen } from "@testing-library/react";
// render: puts a component into the fake browser, screen: lets us look at what's on the page and find things

import userEvent from "@testing-library/user-event";
// lets us pretend to be a user who types and clicks

import CustomButton from "./CustomButton";
// the component we're testing

describe("CustomButton", () => {
  // start a group of tests, all about CustomButton

  it("should render a button with the text 'Click me'", () => {
    // test 1: check the button shows up with the right text

    render(<CustomButton onClick={() => {}} />);
    // show the button on the fake page; it needs an onClick, so we give it an empty function, because this test doesn't care what happens on click

    const button = screen.getByRole("button", { name: "Click me" });
    // look for a button whose text is "Click me"; if there isn't one, this line throws an error and the test fails right here

    expect(button).toBeInTheDocument();
    // expects the button to be on the page
  });

  it("should call the onClick function when clicked", async () => {
    // test 2: check that clicking really triggers onClick, it's async because clicking is something we have to wait for

    const onClick = vi.fn();
    // make a fake function that does nothing, but remembers every time it gets called

    const user = userEvent.setup()
    // create a pretend user who can click

    render(<CustomButton onClick={onClick} />);
    // show the button, and hand it our fake function as its onClick

    const button = screen.getByRole("button", { name: "Click me" });
    // find the button, same as before

    await user.click(button);
    // the pretend user clicks the button, and we wait until the click is done

    expect(onClick).toHaveBeenCalled();
    // expects the fake function to have been called at least once
  });

  it("should not call the onClick function when it isn't clicked", () => {
    // test 3: check that onClick doesn't fire by itself

    const onClick = vi.fn();
    // make another fake function that remembers its calls

    render(<CustomButton onClick={onClick} />);
    // show the button with that fake function, and click nothing

    expect(onClick).not.toHaveBeenCalled();
    // expects the fake function to NOT have been called ("not" flips the check)
  });
});
```

**`vi.fn()`** makes a **fake function** (also called a mock or a spy). It does nothing itself, but it records whether and how many times it was called, so you can check that afterwards.

**What the three tests cover:**
1. It **looks right**: the button exists with the right text.
2. It **works**: clicking calls the function it was given.
3. It's **quiet**: nothing is called until the user clicks.

**Make the check exact.** `toHaveBeenCalled()` only means "at least once". If a bug called `onClick` the moment the button appeared, test 2 would still pass, because the count would be 2 after one click. `toHaveBeenCalledTimes(1)` catches that.

### Setup advice from the lesson

- **Create the mock inside each test**, not in a `beforeEach`. Everything the test needs is then in one place, and nothing leaks between tests. Use `beforeEach` only if the test file is long and the preparation takes dozens of lines.
- **Call `userEvent.setup()` before `render`.**
- **Don't call `render` or `userEvent` outside the test itself** (for example in a `beforeEach`).
- **Repeating the same setup in many tests?** Write a small `setup` function instead.

## 3. Mocking child components

A parent component renders child components. To test the parent alone, replace a child with a minimal fake that shows just enough to prove the parent used it correctly.

An example in Vitest, for a child file `Submission.jsx`:

```jsx
vi.mock("./Submission", () => ({
  // replace everything exported by ./Submission with this fake version

  default: ({ submission }) => (
    // the real component is the default export, so the fake goes under "default";
    // it receives the same props the real one would

    <div data-testid="submission">{submission.id}</div>
    // show only the bare minimum: a tagged div with the id, so a test can
    // find it and check the parent passed the right data
  ),
}));
```

- **The lesson's real example** is a list component from The Odin Project's own site (since removed). It renders one `Submission` per item, a "No Submissions yet" heading when the list is empty, and a paragraph when a certain path prop exists. That's three behaviors, so its tests are split into three `describe` groups, and the child component is mocked.
- **`jest.mock` vs `vi.mock`:** the lesson's example uses `jest.mock`. With Vitest, use `vi.mock`.
- **Test ids:** the lesson's example uses `data-test-id` for its fakes, but React Testing Library finds `data-testid` by default.

## 4. Arrange, Act, Assert

Most tests follow this pattern, and the lesson recommends adopting it. Test 2 above, labelled:

| Step | What it means | In test 2 |
|------|---------------|-----------|
| **Arrange** | Set things up | `vi.fn()`, `userEvent.setup()`, `render(...)`, find the button |
| **Act** | Do the thing | `await user.click(button)` |
| **Assert** | Check the result | `expect(onClick).toHaveBeenCalled()` |


## 5. Quick summary

1. Mocking replaces a real piece with a simple fake so a test checks one thing.
2. `vi.fn()` makes a fake function that records its calls.
3. Test that a callback is called when it should be, and not before.
4. Make checks exact (`toHaveBeenCalledTimes`) so they catch "too early" and "too often".
5. Set up mocks inside each test, and call `userEvent.setup()` before `render`.
6. Mock child components to test a parent alone: `vi.mock` with a minimal fake.
7. Follow Arrange, Act, Assert.
