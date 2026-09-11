/* this function appends a `current` class to a link in the
   header menu if it is for the current page.

   `link.href` is the resolved absolute URL, so it carries any fragment and is
   directly comparable with `document.URL`. Two links count as current, and
   both are the same idea — "this is where the reader already is":

     - an exact match, which is how an in-page link to the anchor the reader
       has scrolled to is marked;
     - a link to this page carrying no fragment of its own, whatever anchor
       the reader is at within it. A related-links panel usually holds one of
       these ("Overview"), and matching only exactly left it looking like an
       ordinary link to somewhere else the moment the reader followed any
       in-page link — which is what `.related_link .current` exists to
       prevent.

   Related-links panels also carry in-page links (`href="#topic__number3"`),
   and following one moves the reader without reloading the page — so the
   marking has to be redone rather than computed once at load. Done once, the
   link the reader arrived at stayed greyed out for the rest of the visit
   however many in-page links they clicked afterwards (issue #192).

   There is no single event to hang that off. Oxygen's own `app/topic.js`
   intercepts a click on an in-page link, calls `preventDefault()`, scrolls
   the page itself and rewrites the address with `history.pushState` — and
   `pushState` fires neither `hashchange` nor `popstate`. So the address can
   change with no event raised anywhere, which is why the panel looked frozen
   while the URL was in fact keeping up. Hence the four hooks below; they
   cover different routes to the same place, and re-marking is idempotent. */
function isCurrentLink(link, curPage, curPageNoFragment) {
    if (link.href == curPage) {
        return true;
    }
    /* `link.hash` is empty only when the link carries no fragment at all, so
       this never claims another topic's anchor link. */
    return link.hash === "" && link.href == curPageNoFragment;
}

function markCurrentLinks() {
    const curPage = document.URL;
    const curPageNoFragment = curPage.split("#")[0];
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        /* toggle, not add: the link marked a moment ago is no longer the
           current one once the reader has moved on from it. */
        link.classList.toggle(
            "current", isCurrentLink(link, curPage, curPageNoFragment));
    }
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        markCurrentLinks();
    }
};

/* A hash typed into the address bar, or a link Oxygen did not intercept. */
window.addEventListener('hashchange', markCurrentLinks);

/* Back and Forward over the entries Oxygen's pushState created. */
window.addEventListener('popstate', markCurrentLinks);

/* The in-page link click itself. Wrapped rather than replaced: the original
   is called first, unchanged and with its return value preserved, so this
   stays invisible to Oxygen — it only gives us the notification the History
   API declines to send. */
for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function () {
        const result = original.apply(this, arguments);
        markCurrentLinks();
        return result;
    };
}
