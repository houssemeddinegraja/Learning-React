# React Router

Notes for The Odin Project's lesson "React Router". The examples are my own, themed on an event website with a home page, a committee and tracks.

## 1. Client-side routing

So far you've built single-page apps. A bigger app has several "pages", each with its own URL.

- **Multi-page site:** every link click asks the server for a new page, and the browser **reloads**.
- **Client-side routing:** JavaScript **intercepts** the click, changes the URL and swaps the components on screen. There's no reload. The browser's **History API** is what lets JavaScript change the URL like this.
- **The catch:** a normal page load tells screen readers there's new content. With client-side routing you have to announce route changes yourself. A good library like React Router helps with this.

**React Router** is the standard routing library for React. You tell it which component to show for which URL.

## 2. Adding a router

Install it:

```bash
npm install react-router
```

Set it up in `main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// the two things we need from React Router

import Home from "./Home";
import Committee from "./Committee";
// the two pages

const router = createBrowserRouter([
  // build a router from a list of routes
  { path: "/", element: <Home /> },
  // at the URL "/", show the Home page
  { path: "committee", element: <Committee /> },
  // at the URL "/committee", show the Committee page
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* instead of rendering <App />, render the router, which picks the page */}
  </StrictMode>
);
```

**Each route is an object** with two required keys: `path` (the URL) and `element` (the component to show). `createBrowserRouter` turns the list into a router, and `RouterProvider` puts it on the page.

## 3. `Link` instead of `<a>`

A plain `<a href>` makes the browser reload the page, which defeats the point. Use React Router's `Link`:

```jsx
import { Link } from "react-router";
// the replacement for <a>

const Home = () => {
  return (
    <nav>
      <Link to="/committee">Meet the committee</Link>
      {/* looks like a link, but changes the page without a reload */}
    </nav>
  );
};

export default Home;
```

## 4. Nested routes, outlets and index routes

**Nested routes** make a child render **inside** its parent, so the parent's layout stays while only part of the page changes.

```jsx
// in the routes list
{
  path: "tracks",
  element: <Tracks />,
  // the parent: its layout shows for every URL starting with /tracks
  children: [
    { index: true, element: <TracksOverview /> },
    // the default child: shown at exactly /tracks
    { path: "workshops", element: <Workshops /> },
    // shown at /tracks/workshops
    { path: "hackathon", element: <Hackathon /> },
    // shown at /tracks/hackathon
  ],
},
```

The parent decides **where** the child appears with an `Outlet`:

```jsx
import { Outlet } from "react-router";
// a placeholder for the child route

const Tracks = () => {
  return (
    <div>
      <h1>Tracks</h1>
      {/* this heading stays the same on every tracks URL */}
      <Outlet />
      {/* the matching child (overview, workshops or hackathon) appears here */}
    </div>
  );
};

export default Tracks;
```

- **Child paths** have no leading slash: `"workshops"`, not `"/workshops"`.
- **`index: true`** marks the child to show when nothing comes after the parent's path.

## 5. Dynamic segments (URL params)

A **dynamic segment** matches a changing value in the URL. A colon marks it:

```jsx
{ path: "committee/:name", element: <Member /> },
// ":name" matches anything: /committee/ali, /committee/sara, ...
```

Read the value with the `useParams` hook:

```jsx
import { useParams } from "react-router";

const Member = () => {
  const { name } = useParams();
  // grabs the :name part of the URL; at /committee/ali, name is "ali"

  return <h1>{name}</h1>;
};

export default Member;
```

**Watch out:** `/committee/:name` does **not** match plain `/committee`. With no name, no route matches, which leads to the next section.

## 6. Handling bad URLs

When no route matches, show a friendly page with `errorElement`:

```jsx
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div>
      <h1>This page doesn't exist.</h1>
      <Link to="/">Back to the home page</Link>
    </div>
  );
};

export default ErrorPage;
```

```jsx
{
  path: "/",
  element: <Home />,
  errorElement: <ErrorPage />,
  // shown when the URL doesn't match any route
},
```

Visit an unused URL, like `/nothing-here`, to check it works.

## 7. Refactoring: a separate `routes.jsx`

Move the routes list into its own file:

```jsx
// routes.jsx
import Home from "./Home";
import Member from "./Member";
import ErrorPage from "./ErrorPage";

const routes = [
  { path: "/", element: <Home />, errorElement: <ErrorPage /> },
  { path: "committee/:name", element: <Member /> },
];

export default routes;
```

```jsx
// main.jsx
import routes from "./routes";

const router = createBrowserRouter(routes);
// build the router from the shared list
```

**Why bother:** `main.jsx` gets shorter, and your **tests can import the same routes** to build a test router (see section 10).

## 8. Outlets and state: passing data down

Sometimes the parent holds state that its child routes need. An `Outlet` has a built-in `context` prop for this:

```jsx
// Layout.jsx (the parent)
import { useState } from "react";
import { Outlet } from "react-router";

const Layout = () => {
  const [members, setMembers] = useState([]);
  // state that lives in the parent

  return <Outlet context={{ members, setMembers }} />;
  // pass anything (an object, an array, ...) through the outlet
};
```

```jsx
// any component rendered inside that outlet, even a "grandchild"
import { useOutletContext } from "react-router";

const MemberList = () => {
  const { members } = useOutletContext();
  // gets whatever the outlet was given; destructure it like any object

  return <p>{members.length} members</p>;
};
```

The lesson says a later lesson covers **context** more fully, without outlets.

## 9. Protected routes and navigation

**Protected routes** decide whether a route should show at all, for example only for logged-in users. The lesson's suggested approach is to **create the router config conditionally**: one set of routes when the user is logged in, and a redirect to the sign-in page otherwise.

**Navigating from code:** `useNavigate` lets you change the URL from inside a function, for example after a login succeeds:

```jsx
import { useNavigate } from "react-router";

const LoginForm = () => {
  const navigate = useNavigate();
  // gives you a function that changes the URL

  const handleSubmit = async e => {
    e.preventDefault();
    // ...send the login request, wait for it to succeed...
    navigate("/dashboard");
    // go to /dashboard
    // navigate(-1) would go back one step in the user's history
  };

  // ...the form...
};
```

**Beyond the lesson:** a common way to protect a single route is a small wrapper component that uses `Navigate`, which redirects when it renders:

```jsx
import { Navigate } from "react-router";

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children : <Navigate to="/login" replace />;
// logged in: show the page; otherwise redirect to /login
// "replace" swaps the history entry, so Back doesn't return to the blocked page
```

## 10. Testing components that use React Router

Your app renders pages **through a router**, so a test must do the same. Rendering a component that uses `Link`, `useNavigate` or `useParams` on its own throws an error.

| Situation | What to render in the test |
|-----------|----------------------------|
| The component just contains a `Link` and you aren't testing navigation | Wrap it in **`MemoryRouter`** (lightweight) |
| It depends on router behavior: params, outlet context, error elements, redirects | Use **`createMemoryRouter`** with your `routes.jsx`, and render a `RouterProvider` |

Tests don't run in a browser, so they use an **in-memory** router instead of a browser one.

```jsx
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routes from "./routes";
// the same routes the real app uses

it("shows the member's name from the URL", () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/committee/ali"],
    // pretend the browser is at /committee/ali
  });

  render(<RouterProvider router={router} />);
  // render the app through the router, like the real app does

  expect(screen.getByRole("heading", { name: "ali" })).toBeInTheDocument();
  // expects the Member page's heading to show the name from the URL
});
```

## 11. Piece-by-piece reference

| Piece | What it does |
|-------|--------------|
| `createBrowserRouter(routes)` | Builds a router from a list of route objects |
| `RouterProvider` | Puts the router on the page |
| `Link to="..."` | A link that changes the page without a reload |
| `children` + `Outlet` | Nested routes: the child renders where the parent puts `<Outlet />` |
| `index: true` | The default child, shown when nothing follows the parent's path |
| `:name` in a path | A dynamic segment, read with `useParams()` |
| `errorElement` | The page to show when no route matches |
| `Outlet context` + `useOutletContext()` | Pass data from a parent to the child routes |
| `useNavigate()` | Change the URL from code (`navigate(-1)` goes back) |
| `MemoryRouter` / `createMemoryRouter` | Routers for tests |


## 13. Quick summary

1. Client-side routing swaps components without reloading the page.
2. Define routes as objects with `path` and `element`, build a router and render it with `RouterProvider`.
3. Use `Link`, not `<a>`.
4. Nested routes render children through `<Outlet />`. `index: true` marks the default child.
5. `:name` makes a dynamic segment, read with `useParams()`.
6. `errorElement` handles URLs that match nothing.
7. Keep routes in `routes.jsx` so tests can reuse them.
8. Share parent data with `<Outlet context={...} />` and `useOutletContext()`.
9. `useNavigate()` redirects from code, and protected routes depend on logged-in state.
10. Tests need a router: `MemoryRouter` for simple cases, `createMemoryRouter` with your routes for the rest.
