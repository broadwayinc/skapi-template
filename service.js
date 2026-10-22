/*
    service.js is loaded by every page of this template.
    It creates the `skapi` object the pages use and takes care of two things every page needs:
    the project id, and sending visitors to the login page when a page needs a logged in user.
*/

/*
    Project ID

    Open any page with ?pid=<Project ID> in the address and the id is read from there.
    It is then kept in sessionStorage, so the other pages work without the parameter as well.
    When you copy this template into your own project, replace the fallback below with your project id.
    You can find the project id on your project's page at www.skapi.com.
*/
const PROJECT_ID_FROM_URL = new URLSearchParams(location.search).get("pid");
if (PROJECT_ID_FROM_URL) {
    sessionStorage.setItem("skapi:project_id", PROJECT_ID_FROM_URL);
}
const PROJECT_ID = PROJECT_ID_FROM_URL || sessionStorage.getItem("skapi:project_id") || "<Project ID>";

/*
    pageUrl(page) returns the full address of another page of this template.
    When a project id is known, it is added to the address as ?pid=,
    so a page can be opened in a new tab or shared and still know which project it belongs to.
    Use it for every link or redirect that is created in a script.
*/
function pageUrl(page) {
    let url = new URL(page, location.href);
    if (PROJECT_ID !== "<Project ID>") {
        url.searchParams.set("pid", PROJECT_ID);
    }
    return url.href;
}

/*
    Links and forms written in the HTML get the project id added once the page has loaded.
    Forms are included because Skapi redirects to a form's action after a successful submit.
    Only relative links to pages of this template are changed (for example "login.html" or "login.html?to=database.html").
*/
function isTemplatePage(href) {
    return /^[a-z-]+\.html([?#].*)?$/.test(href || "");
}

/*
    Enter pressed while a phone keyboard is still composing a word (an IME, for Korean or Japanese for example)
    confirms the word; it must not submit the form with half of it.
*/
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.isComposing || event.keyCode === 229) && event.target.matches("input, textarea")) {
        event.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    for (let a of document.querySelectorAll("a[href]")) {
        if (isTemplatePage(a.getAttribute("href"))) {
            a.href = pageUrl(a.getAttribute("href"));
        }
    }
    for (let form of document.querySelectorAll("form[action]")) {
        if (isTemplatePage(form.getAttribute("action"))) {
            form.action = pageUrl(form.getAttribute("action"));
        }
    }
});

/*
    Pages that need a logged in user.
    A visitor who opens one of them while logged out is sent to login.html,
    and login.html brings them back here after they log in.
    newsletter.html and inquiry.html work without an account, so they are not listed.
*/
const LOGIN_REQUIRED = [
    "database.html",
    "realtime.html",
    "webrtc.html",
    "drawing.html",
    "update-profile.html",
    "change-password.html",
    "remove-account.html",
    "email-verification.html",
];

function currentPage() {
    return location.pathname.split("/").pop() || "index.html";
}

function goToLogin() {
    let to = currentPage() + location.hash;
    location.replace(pageUrl("login.html?to=" + encodeURIComponent(to)));
}

/*
    The options object is passed to the Skapi constructor.
    - autoLogin: when true, a user who logged in before is logged in again automatically.
    - eventListener.onLogin: called with the user's profile when the user logs in or the session is updated,
      and with null when the user logs out.
*/
let options = {
    autoLogin: true,
    eventListener: {
        onLogin: (user) => {
            if (!user && LOGIN_REQUIRED.includes(currentPage())) {
                goToLogin();
            }
        },
    },
};

const skapi = new Skapi(PROJECT_ID, options);

/*
    userReady resolves once the automatic login has been tried.
    It resolves to the user's profile, or to null when nobody is logged in.
    Pages that need the user wait for it: `let user = await userReady;`
*/
const userReady = skapi.getProfile().then((user) => {
    if (!user && LOGIN_REQUIRED.includes(currentPage())) {
        goToLogin();
    }
    return user;
}).catch((err) => {
    console.error(err);
    return null;
});
