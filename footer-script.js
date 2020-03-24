// `alert` and `window.alert` are equivalent
alert("And I'm coming from footer-script.js. Since I'm loaded last, everything is already loaded and it looks fine");

/*
  Did you read the header-script.js file first? Allright, let's dig in!

  Since the footer-script.js file is located at the very bottom of your page, this'll be loaded
  and executed last and your DOM elements will be available at that time (or at least, let's just pretend it is for now).
*/

/*
  There's plenty of other events that exist and could be listened to, here's the reference:
  https://developer.mozilla.org/en-US/docs/Web/Events

  And guess what, there is a "change" event that we can listen to on our <select> \o/
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event

  Let's get a reference to our <select> element first.
  
  But there's so many ways do to it!
  - document.getElementById('theme-selector'), since our <select> was defined with an attribute `name="theme-selector"`
  - document.getElementsByName('theme'), since our <select> was defined with an attribute `name="theme"`
  - document.getElementsByTagName('select'), since we only got one <select> in our page
  - document.getElementsByClassName('theme-selector-input'), since our <select> has the "theme-selector-input" CSS class defined
  But be aware that these getElementsByXXX methods returns an array of matching DOM elements (hence the getElementS with an S)
  compared to getElementById which returns only one element (since an ID should always be unique inside a webpage)

  As we know there's only one element matching, we can just access it with the array index access syntax, for instance:
const matchingElements = document.getElementsByClassName('theme-selector-input');
const selectInput = matchingElements[0]; <-- [0] means "grab the first item inside that array"
  We can write it in a single line, but I think it's more difficult to read for the moment:
const selectInput = document.getElementsByClassName('theme-selector-input')[0]; // <-- see that [0], black magic!

  Let's review one last way to get elements from your page. It's the fanciest and the most up to date:
  https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector to get a single element
  https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll to get multiple elements
*/
const themeSelectorInput = document.querySelector('.theme-selector-input');

/*
  Bam, that's it. With one function, we can write any CSS selector we want, just like if we were inside a CSS file.
  And we can write equivalent selectors to our functions above:
  - document.querySelector('.theme-selector-input'), a simple CSS class
  - document.querySelector('#theme-selector'), an ID
  - document.querySelector('select[name="theme"]'), a more complex selector which gets any <select> element
  that has a "name" attribute with a value of "theme"

  Now that we have our element, let's listen to our "change" event and handle it as needed
*/
themeSelectorInput.addEventListener('change', function(event) {
  /*
    That syntax may seems a bit weird to you. It's just a so called "anonymous" function,
    which we define and pass to the `addEventListener` as a parameter at the same time.
    It's up to you to decide wheter you prefer to define your own function like we did
    in header-script.js (define "setupThemeOnLoad" function then pass it to `document.addEventListener('DOMContentLoaded', setupThemeOnLoad)`)
    or create anonymous functions on the fly.
    My rule of thumb is as follows:
    - if I may reuse a function somewhere, define it with a name (like we did with "setupThemeOnLoad")
    - if not, as it's the case right now, use anonymous function
  */
  alert('Theme selector value changed: ' + themeSelectorInput.value);

  // Let's define our variables with useful default values
  let backgroundValue = '',
      newTheme = themeSelectorInput.value;

  if (newTheme === 'water') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1464925257126-6450e871c667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80)';
  } else if (newTheme === 'wood') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)';
  } else if (newTheme === 'fire') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1533414417583-f0ab99151186?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)';
  } else if (newTheme === 'cats') {
    backgroundValue = 'url(https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1278&q=80)';
  } else {
    // Fallback: the selected value doesn't match any of our themes,
    // so we set it back to null (= default blank theme)
    newTheme = null;
  }

  /*
    Let's change the background image of our page.
    In your page, if I remember correctly, you did something like this:
    document.body.style.background = backgroundValue;

    But let's take a closer look at what is contained in the document.body.style.background property:
  */
  console.log('document.body.style =', document.body.style);
  /*
    Look at your console, and you'll see something like this:
    "rgba(0, 0, 0, 0) url(\"https://images.unsplash.com/photo-1464925257126-6450e871c667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80\") repeat scroll 0% 0%"
    (if you get an empty string, that's ok, it depends on the browser, just bear with me)
    Yep, it's a concatenated version of all of our background-xxx properties we put in our CSS file.
    So, by writing "document.body.style.background = backgroundValue" we are overwrite all properties with just the url of our image.
    That's not what we want, so let's write something more clever:
  */
  document.body.style['background-image'] = backgroundValue;
  /*
    This syntax is different, here's why:
    - document.body.style is an "object", and its properties (aka attributes) are accessed using a dot
    like document.body.style.background (we say "background" is an attribute of the object "document.body.style")
    - "background-image" is also an attribute of the object "document.body.style", but it contains an "illegal character"
    (the dash in the middle)
    - to be able to access it, we can use the array syntax like this: "array[index]" where index is a string
    - it works the same way as the dot syntax, but enables us to use illegal characters in attribute names
    - we can also write document.body.style['background'], but sticking to the dot syntax is a best practice

    Ok so we now only overwriting the "background-image" CSS property, perfect!
  */

  /*
    Now, let's deal with the cookies and pretend there's only one cookie on our page.
    On a real webpage, there'd probably be several cookies but let's not bother for now.

    The documentation says it's a string of key=value pairs,
    separated by semicolon (https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).
    Something like this: "key1=value1;key2=value2;key3=value3".
    For our example, we'll only have one pair like "key1=value1".

    We're gonna overwrite the current cookie value with our new theme value:
  */
  document.cookie = `selectedTheme=${newTheme}`;
  /*
    That's another way of writing string with concatenated values in it.
    It's equivalent to: document.cookie = 'selected_them=' + newTheme;
    just keep in mind that this new syntaxt only works on modern browsers.

    Alright, I think we're all set:
    - our new theme is applied, the background image has been changed
    - we wrote the theme in our cookie in order to retrieve it next time we load the page

    Let's get back to the header-script.js file for the last part.
  */
});