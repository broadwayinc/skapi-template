# Skapi HTML Template

A plain HTML and JavaScript template that shows what you can build with [Skapi](https://www.skapi.com), one page per feature. There is no framework and no build step: each page loads `skapi-js` from a CDN, describes what it demonstrates, and runs the real thing against your own project. Open a page, try it, then view its source to see how it is done.

The same pages are described, with screenshots, under [Full Examples](https://docs.skapi.com/full-example/intro.html) in the Skapi documentation.

## Pages

| Page | What it demonstrates |
| --- | --- |
| `index.html` | The menu: one entry per feature page. |
| `account.html` | The hub of the account pages below, with a **Continue as a guest** button: `anonymousLogin()` signs a visitor in with a temporary account that is deleted 30 minutes after they leave. |
| `signup.html`, `signup-success.html`, `login.html`, `email-verification.html`, `forgot-password.html`, `reset-password.html`, `change-password.html`, `update-profile.html`, `remove-account.html`, `recover-account.html` | Sign up, log in, verify an email address, reset or change a password, update a profile, remove and recover an account. |
| `newsletter.html` | Let visitors subscribe to your newsletter with their email address. |
| `inquiry.html` | A contact form that sends a message to you, the project owner. |
| `database.html` | A photo gallery: upload posts with files, like, comment, subscribe to other users and query posts in different ways. |
| `realtime.html` | Group chat and private messages over a WebSocket connection. |
| `webrtc.html` | Video calls, screen sharing, text chat and file transfer between two users with WebRTC. |
| `drawing.html` | Two users draw on one canvas; every stroke travels over a WebRTC data channel. |

Every page is a short HTML file with the form or demo, a few lines of script, and comments that say which Skapi method does what.

## Running it

You need a Skapi project. Create one at [skapi.com](https://www.skapi.com) and copy its project ID from the project's page.

```sh
npm install
npm run dev
```

Then open `http://localhost:4000/index.html?pid=<Project ID>`. `npm run dev` starts a small static server on port 4000; any other static server works the same way.

The files also open straight from the file system, except `webrtc.html` and `drawing.html`: the browser only allows the camera, the microphone, the screen and WebRTC on HTTPS or on `localhost`.

Pages that need a logged-in user (`database.html`, `realtime.html`, `webrtc.html`, `drawing.html` and the account pages that change an account) send you to `login.html` first and bring you back afterwards. `newsletter.html` and `inquiry.html` work without an account.

The chat, the video chat and the drawing board need two users: open the page in a second browser or device, log in with another account, and join the same group, call, or invite each other.

## The project ID

Open any page with `?pid=<Project ID>` in the address and the ID is read from there. It is then kept in `sessionStorage`, so the other pages work without the parameter, and every link and form action on a page gets `?pid=` added, so a page opened in a new tab still knows its project.

When you copy this template into your own project, replace the `"<Project ID>"` fallback in `service.js` with your project ID and drop the parameter.

## What every page shares

- `service.js` creates the `skapi` object every page uses. It reads the project ID, keeps the login gate (`LOGIN_REQUIRED` lists the pages that need a user), adds the project ID to links and forms (`pageUrl()`), and exposes `userReady`, a promise that resolves to the logged-in user's profile, or `null`.
- `main.css` is one small stylesheet shared by every page. It is plain on purpose: one column, the system font, thin borders and no colours other than links, so the pages read like a document and do not get in the way of your own design.
- The `skapi-js` library comes from `https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js`. Pin a version there if you want the pages to stay exactly as they are.

## Adding a page

1. Copy an existing page. Keep the `<head>` (stylesheet, `skapi-js`, `service.js`), the breadcrumb and the description above the demo.
2. If the page needs a logged-in user, add its file name to `LOGIN_REQUIRED` in `service.js` and wait for `userReady` before using the user.
3. Add the page to the menu in `index.html`.

## Learn more

- [Skapi documentation](https://docs.skapi.com)
- [skapi-js on npm](https://www.npmjs.com/package/skapi-js)
