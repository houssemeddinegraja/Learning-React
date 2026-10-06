# Learning React - Quick Start and Basic Components

## What is JSX?

JSX is a syntax extension for JavaScript that lets you write HTML-like markup directly inside your JavaScript code. It looks like HTML, but it's actually JavaScript under the hood — tags like `<button>` or `<div>` get compiled into regular function calls that React uses to build the UI. JSX is used throughout React components to describe what the UI should look like, embed dynamic values with curly braces (`{}`), and nest components inside one another. It's optional, but nearly every React project uses it because it makes component markup easier to read and write.

---
## Basic components

1. `MyButton` — the simplest possible component.
```js
function MyButton() {
  return <button>I'm a button</button>;
}
```
Just a function that returns some markup.

2. `MyApp` — a parent component that nests `MyButton` inside it.
```js
function MyApp() {
  return (
    <div>
      <h1>Welcome</h1>
      <MyButton />
    </div>
  );
}
```
Shows how components can contain other components.

3. `AboutPage` — demonstrates JSX's "one root element" rule using a fragment (`<>...</>`).
```js
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.</p>
    </>
  );
}
```

4. `Profile` — displays data from a JavaScript object using curly braces.
```js
function Profile() {
  return <h1>{user.name}</h1>;
}
```
Shows embedding variables (`{user.name}`) and dynamic attributes (`src={user.imageUrl}`).

5. `AdminPanel` / `LoginForm` — mentioned (not fully defined) to illustrate conditional rendering.
```js
{isLoggedIn ? <AdminPanel /> : <LoginForm />}
```
One or the other renders depending on a condition.

6. `ShoppingList` — renders a list of items from an array using `.map()`.
```js
function ShoppingList() {
  const items = products.map(p => <li key={p.id}>{p.title}</li>);
  return <ul>{items}</ul>;
}
```
Each item needs a unique `key`.

7. `MyButton` (stateful version) — adds a click counter using `useState`.
```js
function MyButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```
Each instance of this button remembers its own count independently.

8. `MyApp` + `MyButton` (shared state) — the count moves up to `MyApp` and gets passed down as a prop, so both buttons stay in sync.
```js
function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <MyButton count={count} onClick={() => setCount(count + 1)} />
      <MyButton count={count} onClick={() => setCount(count + 1)} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}
```
This pattern is called "lifting state up."

