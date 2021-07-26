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

const iO = new IntersectionObserver(entries => entries.forEach(entry => {
    const hash = '#' + entry.target.id;
    const navEl = $ `[href="${hash}"]`;
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        navEl.classList.add('focus');
        updateHistory(hash);
    } else {
        navEl.classList.remove('focus');
    }
}), {
    root: $ `main`,
    threshold: 0.5
});



window.addEventListener('DOMContentLoaded', () => $$ `article`.map(a => iO.observe(a)));
window.addEventListener('hashchange', function(e) {
    const articleToShow = $(window.location.hash || '#' + $ `article`.id);
    articleToShow.scrollIntoView();
    e.preventDefault();
}, false);

/* Update the window URL on swipe, this is throttled so that the history doesn't get filled with useless entries*/
function updateHistory(hash) {
    clearTimeout(updateHistory.timeout);
    updateHistory.timeout = setTimeout(function() {
        if (window.location.hash !== hash) {
            if (location.hash !== '') {
                history.pushState({}, window.title, hash);
            } else {

                // On first page load update the URL in place
                history.replaceState({}, window.title, hash);
            }
        }
    }, 1000);
}

window.addEventListener('load', e => {
    // new PWAConfApp();
    registerSW();
});

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.log("ServiceWorker registration failed.");
        }
    } else {
        document.querySelector('.alert').removeAttribute('hidden');
    }
}

window.addEventListener('beforeinstallprompt', function(event) {
    // not show the default browser install app prompt
    event.preventDefault();
    // add the banner here or make it visible
    // …
    // console.log("App non installata");
    // $('#install_button').css('display', 'flex');

    // save the event to use it later
    // (it has the important prompt method and userChoice property)
    window.promptEvent = event;
});


document.addEventListener('click', function(event) {
    if (event.target.matches('.install-trigger')) {
        addToHomeScreen();
    }
});

function addToHomeScreen() {
    // show the install app prompt
    window.promptEvent.prompt();

    // handle the Decline/Accept choice of the user
    window.promptEvent.userChoice.then(function(choiceResult) {
        // hide the prompt banner here
        // …

        if (choiceResult.outcome === 'accepted') {
            console.info('mm User accepted the A2HS prompt');
        } else {
            console.info('mm User dismissed the A2HS prompt');
        }

        window.promptEvent = null;
    });
}