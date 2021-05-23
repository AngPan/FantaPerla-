const $ = (...s) => {
    const str = Array.isArray(s[0]) ? String.raw(...s) : s[0];
    return str[0] === '<' ? document.createRange().createContextualFragment(str) : document.querySelector(str);
}

const $$ = (...s) => {
    const str = Array.isArray(s[0]) ? String.raw(...s) : s[0];
    return Array.from(str[0] === '<' ? $(str).children : document.querySelectorAll(str));
}

/* Function for fetching a document fragment and replacing an element with it */
function replace(el, url) {
    return fetch(url)
        .then(r => r.text())
        .then(html => {
            el.parentNode.insertBefore($(html), el);
            el.remove();
        });
}