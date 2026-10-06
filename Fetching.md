# Fetching Data in React


## 1. The big picture

So far our React apps only used data that we typed ourselves. Real apps get data from **outside** (a server or an API) and show it on screen.

Remember from the effects lesson: fetching data is a **side effect**, because it talks to something outside React. So the recipe is always:

1. **`useState`** to hold the data (and also the loading and error status).
2. **`useEffect`** with `[]` to send the request once, when the component first appears.
3. **Conditional returns** to show "Loading...", an error message, or the data.

Every request needs at least **3 pieces of state**: `data`, `loading`, `error`.

## 2. A basic fetch (plain JavaScript, no React)

```javascript
const image = document.querySelector("img"); // find the <img> tag on the page and keep it in a variable called image
fetch("https://picsum.photos/v2/list") // send a request to this address to get a list of photos (the answer comes later, not instantly)
  .then((response) => response.json()) // when the answer arrives, turn its body from raw text into a JavaScript array
  .then((response) => { // when that is done, run this code with the converted data (called response here)
    image.src = response[0].download_url; // take the first photo in the list and put its link into the img tag so the photo shows
  }) // end of this step
  .catch((error) => console.error(error)); // if anything above failed, print the error in the console
```

Key idea: `fetch` returns a **promise** ("I'll give you the answer later"). `.then` means "when it's ready, do this". `.catch` means "if it fails, do this".

## 3. Fetch inside a React component

```jsx
import { useEffect, useState } from "react";

const Image = () => { 
  const [imageURL, setImageURL] = useState(null); 

  useEffect(() => { // run this code after the component first appears on screen
    fetch("https://picsum.photos/v2/list") // ask the server for the list of photos
    .then((response) => response.json()) // turn the answer into usable data
    .then((response) => setImageURL(response[0].download_url)) // save the first photo's link in state, which makes React re-render
    .catch((error) => console.error(error)); // if something fails, just print the error in the console
  }, []); // the empty array means "run only once, when the component first appears"

  return ( 
    imageURL && (
      <>
        <h1>An image</h1> {/* a big heading */}
        <img src={imageURL} alt={"placeholder text"} /> 
      </> 
    ) 
  ); 
}; 

export default Image; 
```

**Why `useEffect` and not just writing `fetch` in the body?** The body runs on every re-render, so you'd send a request every time, and the state change from each answer would trigger another request. Same loop as the `setInterval` problem. `[]` makes it run once.

## 4. Handling errors

The network is unreliable: the server can be down, your connection can drop, or the answer can be wrong. If you don't plan for it, the page stays **blank** and the user has no idea what happened.

### Step 1: add an `error` state

```jsx
const [imageURL, setImageURL] = useState(null); 
const [error, setError] = useState(null); 
```

### Step 2: save the error, and also check the response status

```jsx
useEffect(() => { // run this after the component first appears
  fetch("https://picsum.photos/v2/list") // ask the server for the list of photos
    .then((response) => { // when the server answers, check the answer first
      if (response.status >= 400) { // status codes of 400 or more mean a problem (404 not found, 500 server error...)
        throw new Error("server error"); // create an error on purpose, which jumps straight to .catch
      } 
      return response.json(); // all good, so turn the body into data and pass it to the next .then
    }) 
    .then((response) => setImageURL(response[0].download_url)) // save the first photo's link in state
    .catch((error) => setError(error)); // if anything failed, save the error in state so we can show a message
}, []); // run only once
```

**Why check the status?** `fetch` only fails by itself when the request can't be sent at all (for example, no internet). If the server answers with "404" or "500", `fetch` still counts that as a successful request. That's why we throw our own error.

### Step 3: show the error to the user

```jsx
if (error) return <p>A network error was encountered</p>; 

return ( 
  imageURL && ( 
    <>
      <h1>An image</h1>
      <img src={imageURL} alt={"placeholder text"} /> 
    </> 
  ) 
); 
```

## 5. Loading state

While waiting for the answer, the page is blank too. A `loading` state fixes that.

```jsx
const Image = () => {
  const [imageURL, setImageURL] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => { 
    fetch("https://picsum.photos/v2/list") // ask the server for the list of photos
      .then((response) => { // when the server answers
        if (response.status >= 400) { // if the answer is a bad status (400 or more)
          throw new Error("server error"); // make an error on purpose so .catch handles it
        } 
        return response.json(); // otherwise, turn the body into data
      }) 
      .then((response) => setImageURL(response[0].download_url)) // save the first photo's link
      .catch((error) => setError(error)) // if anything failed, save the error
      .finally(() => setLoading(false)); // whether it worked or failed, mark the waiting as finished
  }, []); // run only once

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>A network error was encountered</p>; 
  return ( 
    <> 
      <h1>An image</h1> 
      <img src={imageURL} alt={"placeholder text"} />
    </> 
  ); 
}; 
```

The **order of the checks matters**: loading first, then error, then the real content.

`.finally` runs in both cases (success or failure), which makes it the right place for `setLoading(false)`.

## 6. Custom hooks

All that fetching code makes the component long. We can move it into our own **custom hook**.

- A hook is just a function that can use React features (`useState`, `useEffect`...).
- The naming rule: the name **must start with `use`** followed by a capital letter (`useImageURL`).
- React only allows hooks to be called at the top level of a component or of another hook, so a normal helper function like `getImageURL` can't contain `useEffect`. Renaming it `useImageURL` turns it into a proper hook.

```jsx
import { useState, useEffect } from "react"; 

const useImageURL = () => { 
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => { // run this after the component first appears
    fetch("https://picsum.photos/v2/list") // ask the server for the list of photos
      .then((response) => { // when the server answers
        if (response.status >= 400) { // if the status says something went wrong
          throw new Error("server error"); // make an error on purpose
        } 
        return response.json(); // otherwise, turn the body into data
      }) 
      .then((response) => setImageURL(response[0].download_url)) // save the first photo's link
      .catch((error) => setError(error)) // if anything failed, save the error
      .finally(() => setLoading(false)); // either way, we're done waiting
  }, []); // run only once

  return { imageURL, error, loading }; // hand the three values back to whoever called this hook
}; 

const Image = () => { 
  const { imageURL, error, loading } = useImageURL(); // call our hook and take the three values it gives back

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>A network error was encountered</p>; 

  return ( 
    <>
      <h1>An image</h1>
      <img src={imageURL} alt={"placeholder text"} />
    </>
  ); 
}; 
```

Benefits: the component is short and easy to read, and any other component can reuse `useImageURL()` without copying the fetching logic.

## 7. Multiple requests: the "waterfall" problem

In the lesson's example (the `fetching-data/` folder of the `react-examples` repo), a `Profile` component fetches an image, and its child `Bio` fetches the bio text.

**The problem:**
- A child component doesn't exist until its parent renders it.
- `Profile` doesn't render `<Bio />` until its own image has loaded (because of the `imageURL &&` check).
- So `Bio` only starts its request **after** `Profile`'s request finishes. The requests happen one after the other, like a waterfall, and `Bio` shows up a second later than it should.

```
Waterfall (slow):
Profile renders → fetches image → image arrives → Bio renders → Bio fetches text → text arrives

Lifted up (faster):
Profile renders → fetches image AND text at the same time → Bio gets its text as a prop
```

**The fix:** lift the request up. Let the parent fetch both things and pass the data down as props.

A simplified sketch (my own example with made-up addresses, not the lesson's exact code):

```jsx
useEffect(() => { 
  fetch("/api/image") // request 1 (a made-up address): the photo link
    .then((res) => res.json()) // turn the answer into data
    .then((data) => setImageURL(data.url)); // save the link in state

  fetch("/api/bio") // request 2 (a made-up address): starts right away, without waiting for request 1
    .then((res) => res.json()) // turn the answer into data
    .then((data) => setBioText(data.text)); // save the text in state
}, []); // run only once

// later, in Profile's return:
// <Bio text={bioText} /> // pass the text down to Bio as a prop; Bio no longer fetches anything itself
```

## 8. Data fetching libraries

Libraries exist to help with fetching, but The Odin Project recommends using **plain React** (what you see above) for all course projects, because you learn the fundamentals by doing it yourself.


## 10. Cheat sheet

| Need | Tool |
|---|---|
| Hold the data | `useState(null)` |
| Send the request once on load | `useEffect(() => { ... }, [])` |
| Detect a bad server answer | `if (response.status >= 400) throw new Error(...)` |
| Catch failures | `.catch((error) => setError(error))` |
| Know when the request ended | `.finally(() => setLoading(false))` |
| Show the right screen | `if (loading) ...`, then `if (error) ...`, then the content |
| Reuse the fetching logic | A custom hook named `useSomething` |
| Avoid slow waterfalls | Fetch in the parent and pass data down as props |

**Common mistakes**
- Forgetting `[]`, so the request runs on every render.
- Not checking `response.status`, so a 404 looks like a success.
- Checking `error` before `loading`, or forgetting `loading` entirely and getting a blank screen.
- Giving a custom hook a name that doesn't start with `use`.
