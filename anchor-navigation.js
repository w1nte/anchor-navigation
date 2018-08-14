'use strict';

const INTERSECTION_OBSERVER = ('IntersectionObserver' in window);
//const INTERSECTION_OBSERVER = false; // debug


class AnchorNavigation {
    constructor (navigation_entries, config) {
        let $this = this;

        this.defaultConfig = {
            "navigation_entries": "#navigation li",
            "navigation_current_class": "current",
            "home_anchor": "home",
            "onclick_callback": function (e) {
                console.log(":)");
            }
        };
        this.config = this.extend({}, this.defaultConfig, {"navigation-entries": navigation_entries}, config);

        let nav_entries = this.find_nav_entries(this.config["navigation_entries"]);

        let observer = this.register_observer(function(entry) {
            nav_entries.set_current_page_class(entry.id, $this.config["navigation_current_class"]);
        });

        if (!observer) { // fallback
            let si = 0, scroll_precision = 5;
            window.addEventListener("scroll", function() {
                si++;
                if (si > scroll_precision) {

                    nav_entries.entries.forEach(entry => {
                        if (entry.key) {
                            let anchorDest = document.querySelector("#" + entry.key);
                            if (anchorDest) {
                                let domRect = anchorDest.getBoundingClientRect();
                                if (domRect.top < window.innerHeight && domRect.top > 0)
                                    nav_entries.set_current_page_class(anchorDest.id, $this.config["navigation_current_class"]);
                            }
                        }
                    });

                    si = 0;
                }

            })
        }

        nav_entries.entries.forEach(entry => {
            if (entry.key) {
                let anchorDest = document.querySelector("#" + entry.key);
                if (anchorDest && observer)
                    observer.observe(anchorDest);

                entry.anchor_element.addEventListener("click", function(e) {
                    $this.config["onclick_callback"](e);
                });
            }
        });
    }

    register_observer (callback) {
        if (!INTERSECTION_OBSERVER)
            return false;

        let observer;

        let options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        };

        let cb = function(entries, observer) {

            entries.forEach(entry => {
                if (entry.intersectionRatio >= 1) {
                    callback(entry.target);
                }
            });
        };

        observer = new IntersectionObserver(cb, options);

        return observer;
    }

    find_nav_entries (li_elements) {
        let nav_entries = new NavEntries();
        let nav_li_elements = document.querySelectorAll(li_elements);

        nav_li_elements.forEach(li_element => {
            let anchor_element = li_element;
            if (li_element.tagName !== "A")
                anchor_element = li_element.querySelector('a');

            let anchor = anchor_element.href.split("#")[1];
            if (li_element.classList.contains(this.config['navigation_current_class'])) {
                anchor = this.config['home_anchor'];
                anchor_element.href += "#" + this.config['home_anchor'];
            }
            if (anchor)
                nav_entries.add(anchor, li_element, anchor_element);
        });

        console.log(nav_entries);

        return nav_entries;
    };

    extend (...args) {
        for(let i=1; i<args.length; i++)
            for(let key in args[i])
                if(args[i].hasOwnProperty(key)) {
                    if (AnchorNavigation.is_dictionary(args[i][key]))
                        args[0][key] = this.extend(args[0][key], args[i][key]);
                    else
                        args[0][key] = args[i][key];
                }
        return args[0];
    }

    static is_dictionary (variable) {
        return typeof variable === 'object' && variable!==null && !(variable instanceof Array) && !(variable instanceof Date)
    }
}

class NavEntries {
    constructor (options) {
        this.entries = [];
    }

    push (nav_entry) {
        if (nav_entry instanceof NavEntry)
            this.entries.push(nav_entry);
    }

    add (key, list_element, anchor_element) {
        let nav_entry = new NavEntry(key, list_element, anchor_element);
        this.push(nav_entry);
    }

    find (key) {
        return this.entries.find(function(elm) {
            return elm.key === key;
        });
    }

    set_current_page_class (key, class_name) {
        this.entries.map(entry => entry.list_element.classList.remove(class_name));
        this.find(key).list_element.classList.add(class_name);
    }
}

class NavEntry {
    constructor (key, list_element, anchor_element) {
        this.key = key; // anchor without hash for identification
        this.list_element = list_element; // the list element with the current page class e.g <li>
        this.anchor_element = anchor_element; // the anchor element with the url e.g <a>
    }
}


(function($) {

    $.fn.anchorNavigation = function(options={}) {
        let anchor_nav = new AnchorNavigation(this[0], options);
        return this;
    };

})(jQuery);