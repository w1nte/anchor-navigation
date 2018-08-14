# Anchor Navigation

JS Anchor Navigation Library that automatically updates the navigation current class. [See Example](https://w1nte.github.io/anchor_navigation/)

## Features
* Automatically updates navigation's current item.
* Uses modern web technique for more performance
* Polyfill's integrated!

## Usage
#### with jQuery
`````javascript
$(document).ready(function() {

    $('#navigation li').anchorNavigation({
        "navigation_current_class": "current",
        "home_anchor": "home",
        "onclick_callback": function(e) {} // click on navigation links
    });

});
`````

#### without jQuery
`````javascript
var anchor_nav = new AnchorNavigation('#navigation li', {
        "navigation_current_class": "current",
        "home_anchor": "home",
        "onclick_callback": function(e) {} // click on navigation links
    });
`````

If you want smooth scrolling, see index.html (requires jquery)