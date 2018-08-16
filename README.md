# Anchor Navigation

JS Anchor Navigation Library that automatically updates the navigation current class if scrolling. [See Example](https://w1nte.github.io/anchor_navigation/)

## Features
* Easy to integrate!
* Automatically updates navigation's current item.

## Usage
##### with jQuery
```javascript
$(document).ready(function() {

    $('#navigation li').anchorNavigation({
        "navigation_current_class": "current",
        "home_anchor": "home",
        "navigation_onclick_callback": function(entry, e) {
            // smooth scrolling, requires jquery
            $('html, body').animate({
                scrollTop: entry.key === 'home' ? 0 : (entry.heading_container.offsetTop)
            }, 'slow');
            e.preventDefault();
        }
    });

});
```

##### without jQuery
```javascript
window.addEventListener("load", function(event) {
    var anchor_nav = new AnchorNavigation('#navigation li', {
            "navigation_current_class": "current",
            "home_anchor": "home",
            "navigation_onclick_callback": function(entry, e) { }
        });
}, false);
```

### Available Arguments
```javascript
{
    "navigation_current_class":     ["current"],                    // current page class
    "heading_container":            "div, section, article",        // container which separates the content
    "home_anchor":                  "home",                         // virtual anchor of the original home list element
    "threshold":                    0.5,
    "timeout":                      250,                            // scrolling debounce timeout
    "navigation_onclick_callback":  function (entry, e) { },
    "navigation_onupdate_callback": function (entry) { }
}
```

## Supported Browsers
* Edge >= 17
* Chrome >= 68
* Firefox >= 61

The Library doesn't work in IE without polyfills!