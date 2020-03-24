window.alert("Hi there, I'm coming from header-script.js. Look, the content of the page isn't loaded yet!");

/*
  Since this file is loaded (and executed) before everything else in your page,
  be careful to what you put into it: resource heavy code may block the rest of your page while it's beeing processed by the browser
*/

/*
  When the page loads, we need to check the cookie in order to find out
  what theme the user had previously selected.
  There's a couple way we can do this in JS:

  1) <body onload="setupThemeOnLoad()">
    That's the way you did if I remember correctly.
    Defining "event handlers" inside your HTML is a little bit "old school" but it works fine.

  2) The equivalent of #1 in full JS is this:
window.onload = setupThemeOnLoad;
    Which means: the "onload" event handler of the page is now my "setupThemeOnLoad" function.

    But here's the trick: according to the documentation (https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload),
    this "load" event waits for everything in our page to load, including images, stylesheets, etc.
    Sometimes, you want (or need) to bind JS event handlers (or do some treatment on elements of your page)
    right when the content of the page is build, meaning the DOM, the HTML elements are ready to be used
    and manipulated by your JS.
    To tackle that problem, here comes #3

  3) DOMEvent, especially DOMContentLoaded (https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
    This event is triggered when the DOM (the HTML nodes and elements) are ready, but before assets (images and the likes) are downloaded.
    This is much better, since it means we can already bind event handlers while the browser is downloading and processing the other assets.
    Usage is fairly simple. It just registers a new "event listener" (aka event handler) that will be call whenever that event is triggered.
    We want to know when this specific event is trigger on our "document" (= our page) so we write it like this:
*/
document.addEventListener('DOMContentLoaded', setupThemeOnLoad);
/*
  (don't bother with the function implementation for now, we'll check it later)

  That's cool, now let's get our <select> element to handle when its value changes.
  Let's do the old fashioned way:
*/
const selectElement = document.getElementById('theme-selector');
console.log('selectElement inside header-script', selectElement);
/*
  Reload the page and check your console... WTF? Our selectElement variable contains null?

  Remember the thing where I said header-script.js was loaded and executed before the rest of the page?
  Well, here we are: the HTML elements of your page aren't available at this point inside this script.

  Next stop, the footer-script.js file. Let's go!
*/

/* --------------------------------------------------------------------------------------------------------------------- */

/*
  Alright, let's tackle the last part: re-select the correct theme with our cookie
*/
function setupThemeOnLoad() {
  /*
    We know the value of document.cookie should be something like "selectedTheme=wood"
    But how can we grab just the "wood" part after "selectedTheme="?

    First, let's split the key and the value parts:
  */
  const parts = document.cookie.split('=');
  /*
    The variable `parts` is an (indexed) array that looks like this:
    [
      0 => "selectedTheme",
      1 => "wood"
    ]
    We got two numerical keys that each contains a part of our splitted string.
    We can now get the "wood" value by user the array syntax we discussed earlier,
    and remember: programers start counting at 0, not 1 ^_^
  */
  const selectedTheme = parts[1]; // the 2nd part is stored at the index 1

  // Let copy/paste some of our previous code
  // Let's define our variables with useful default values
  let backgroundValue = '',
      newTheme = selectedTheme;
  if (newTheme === 'water') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1464925257126-6450e871c667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80)';
  } else if (newTheme === 'wood') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)';
  } else if (newTheme === 'fire') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1533414417583-f0ab99151186?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)';
  } else if (newTheme === 'cats') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1278&q=80)';
  } else {
    newTheme = null;
  }
  document.body.style['background-image'] = backgroundValue;

  /*
    And finally, let's pre-select the current theme inside our <select>.
    We get it back with document.querySelector (we're inside a function so we cannot reuse
    the one we got inside footer-script.js, let alone that this is another file and complete context),
    and overwrite the value of our <select> with the one we want.
  */
  const themeSelectorInput = document.querySelector('.theme-selector-input');
  themeSelectorInput.value = newTheme;
}

/*
  See how we copied-pasted all those if/else and image urls? That doesn't feel right, don't you think?
  What about we want to add another theme? We should edit the two files accordingly, and that's error-prone.
  That's another rule of thumb: if you copy/paste something more than one (or twice), you should refactor it
  and put it somewhere reusable (like inside a dedicated function for example)

  In our case we should've defined a (named, not anonymous) function that is responsible of
  chaning background image, and use that where it's needed. But that's a topic for another day!
*/