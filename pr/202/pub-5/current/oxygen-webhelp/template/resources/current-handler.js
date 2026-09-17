/* Marks the links in the header menu and the related-links panel according to
   where the reader is. Two marks, because the panel needs two different facts
   and one class cannot carry both:

     `current`    this link points at exactly where the reader is — the page
                  top when there is no fragment, or the anchor they are at.
                  `.related_link .current` greys it out and makes it
                  unclickable: there is nowhere for it to take them.

     `same-page`  following this link would not leave the page being read.
                  The badge in the panel means "this takes you off this page",
                  so a link marked `same-page` does not get one. It is a
                  *wider* set than `current`: the panel's link to this topic
                  ("Signature", "Overview") is on this page wherever the
                  reader has scrolled to, so it never wears the badge — but it
                  stays live while they are partway down, because clicking it
                  takes them back to the top, which is somewhere to go.

   Only the browser knows which page it is on, so both marks have to be made
   at run time; `.related-links a[href^="#"]` is the one same-page case the
   stylesheet can see for itself.

   `link.href` is the resolved absolute URL, so it carries any fragment and is
   directly comparable with `document.URL`.

   Related-links panels carry in-page links (`href="#topic__number3"`), and
   following one moves the reader without reloading the page — so the marking
   has to be redone rather than computed once at load. Done once, the link the
   reader arrived at stayed greyed out for the rest of the visit however many
   in-page links they clicked afterwards (issue #192).

   There is no single event to hang that off. Oxygen's own `app/topic.js`
   intercepts a click on an in-page link, calls `preventDefault()`, scrolls
   the page itself and rewrites the address with `history.pushState` — and
   `pushState` fires neither `hashchange` nor `popstate`. So the address can
   change with no event raised anywhere, which is why the panel looked frozen
   while the URL was in fact keeping up. Hence the four hooks below; they
   cover different routes to the same place, and re-marking is idempotent. */
function withoutFragment(url) {
    return url.split("#")[0];
}

function markCurrentLinks() {
    const curPage = document.URL;
    const curPageTop = withoutFragment(curPage);
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        /* toggle, not add: the link marked a moment ago is no longer the
           current one once the reader has moved on from it. */
        link.classList.toggle("current", link.href == curPage);
        link.classList.toggle(
            "same-page", withoutFragment(link.href) == curPageTop);
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
