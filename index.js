/* Function for fetching a document fragment and replacing an element with it */
function replace(el, url) {
    return fetch(url)
        .then(r => r.text())
        .then(html => {
            el.parentNode.insertBefore($(html), el);
            el.remove();
        });
}