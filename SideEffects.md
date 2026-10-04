# React: Side Effects and `useEffect`

## 1. Concepts

**Side effect:** anything a component does besides returning UI.
Examples: fetching data, starting a timer, listening to the window, changing the page title.

**Render vs re-render**
- **Render:** React calls your component function to find out what the screen should show.
- **Re-render:** React calls the *same* function again because state or props changed.
- The component is not recreated. State keeps its value (`useState(0)` only uses `0` on the first render).
- Everything in the function body runs again on every re-render.

## 2. Why effects can't go in the component body

`setInterval` is a **browser** function. Each call adds a new timer. It never checks if one already exists.

```jsx
function Clock() {
  const [counter, setCounter] = useState(0);

  // BAD: runs on every render
  setInterval(() => setCounter(c => c + 1), 1000);

  return <p>{counter} seconds</p>;
}
```

The loop:
1. Render, so `setInterval` creates timer A.
2. A fires, so `setCounter` changes state.
3. State change causes a re-render, so `setInterval` creates timer B.
4. A is still running. Now there are 2 timers, then 4, then 8...

| Time | Timers firing | New timers | Total after |
|------|---------------|------------|-------------|
| 0s   |               | 1          | 1           |
| 1s   | 1             | 1          | 2           |
| 2s   | 2             | 2          | 4           |
| 3s   | 4             | 4          | 8           |

## 3. `useEffect` syntax

```jsx
useEffect(
  () => {
    // 1. EFFECT: what to do (runs after render)

    return () => {
      // 3. CLEANUP: undo what the effect started
    };
  },
  [] // 2. DEPENDENCIES: when to run
);
```

## 4. The dependency array

```jsx
useEffect(() => { /* ... */ });         // after EVERY render
useEffect(() => { /* ... */ }, []);     // once, on mount
useEffect(() => { /* ... */ }, [a, b]); // on mount, then whenever a or b changes
```

- State controls whether the **component** re-renders.
- The array controls whether the **effect** runs again.
- Put in `[ ]` only the values the effect **reads**. Listen to your linter's warnings.

Example: refetch when `userId` changes.

```jsx
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));
}, [userId]);
```

### Example: the tab title follows the name

From the CV app: show the typed name in the browser tab.

```jsx
useEffect(() => {
  document.title = info.name || 'CV Filler';
}, [info.name]);
```

- **On load:** the first render always runs the effect. `info.name` is `''`, so the title is "CV Filler".
- **While typing:** each keystroke changes `info.name`, so the effect runs again and the title follows.
- **With `[]` instead:** the effect runs once, so the title stays "CV Filler" however much you type.

### Example: fetching data when the page opens

```jsx
function Committee() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function loadMembers() {
      const res = await fetch('/api/committee');
      const data = await res.json();
      setMembers(data);
    }
    loadMembers();
  }, []);

  return (
    <ul>
      {members.map(m => (
        <li key={m.id}>{m.name}</li>
      ))}
    </ul>
  );
}
```

- **`[]`** because the fetch reads no value that changes. If it read one (like `year`), the array would be `[year]`.
- **The `async` function lives inside the effect.** The function passed to `useEffect` can't be `async`: React expects it to return nothing or a cleanup function, and an `async` function returns a promise.
- **`useState([])`** gives the first render (before any data arrives) an empty array that `.map` can loop over.

**Order of execution**
1. Render 1: `members` is `[]`, so the list is empty.
2. After the screen updates, the effect runs and starts the fetch.
3. The data arrives and `setMembers(data)` changes the state.
4. Render 2 (a re-render): `members` is full, so the list shows.
5. React checks the array: `[]` hasn't changed, so the effect does **not** run again.

## 5. The cleanup function

If the effect **starts** something, the cleanup **stops** it.

```jsx
useEffect(() => {
  const id = setInterval(() => setCounter(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);
```

Cleanup runs:
- Right before the effect runs again
- When the component is removed from the screen

**StrictMode (development only)** mounts, unmounts, and remounts your component on purpose. Without cleanup you get two timers. With cleanup, the first is stopped.

## 6. Comparing the versions

| Version | Result |
|---------|--------|
| `[]` + cleanup | 1 timer, created once. Best version. |
| `[counter]` + cleanup | 1 timer at a time, but destroyed and recreated every second. Works, wasteful. |
| `[counter]`, no cleanup | Timers pile up (4 after 2s, 8 after 3s). Counter runs away. |

`setCounter(c => c + 1)` gets the latest value by itself, so the effect doesn't need `counter` in its dependencies. `setCounter(counter + 1)` would need `[counter]`.

## 7. Do I need an effect?

Ask: *"Am I syncing with something outside React?"* Yes means `useEffect`. No means you probably don't need it.

```jsx
// Calculated from state: no effect needed
const sum = number1 + number2;

// User events: use event props, not effects
<input onChange={handleInput} value={input} />
```

**Event handler or effect?**

| It runs because...                             | Where it goes        | Example                                                                     |
|------------------------------------------------|----------------------|-----------------------------------------------------------------------------|
| The user did something                         | An **event handler** | The Save button; a login `fetch` on submit                                  |
| The component is on screen, or a value changed | **`useEffect`**      | Loading a list when a page opens; updating the tab title as a name changes |

- **Reset state when something changes:** give the component a `key`.
- **Share state between components:** lift it up to the common parent.

## 8. Quick summary

1. A side effect is anything a component does besides drawing UI.
2. Put side effects in `useEffect` so they don't run on every render.
3. The dependency array controls **when** it runs. The cleanup controls how to **undo** it.
4. Every time an effect starts something, ask what stops it.
5. Don't use an effect if you can calculate it during render or handle it in an event.
