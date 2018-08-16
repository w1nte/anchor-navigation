
class AnchorNavigation {
    constructor (navigation_list_elements, config) {
        let $this = this;

        this.defaultConfig = {
            "navigation_list_elements": "#navigation li",
            "navigation_current_class": ["current"],
            "heading_container": "div, section, article",
            "home_anchor": "home",
            "threshold": 0.5,
            "timeout": 250, // debounce timeout
            "navigation_onclick_callback": function (entry, e) { },
            "navigation_onupdate_callback": function (entry) { }
        };
        this.config = AnchorNavigation.extend({}, this.defaultConfig, {"navigation_list_elements": navigation_list_elements}, config);

        this.nav_entries = new NavEntries();

        this.update_nav_entries();
    }

    update_nav_entries () {
        let $this = this;

        this.nav_entries = this.find_nav_entries(this.config.navigation_list_elements);

        let is_scrolling;
        window.addEventListener("scroll", function() {
            window.clearTimeout(is_scrolling);
            is_scrolling = setTimeout(function() {

                $this.update($this.nav_entries);

            }, $this.config.timeout);
        }, false);

        this.nav_entries.entries.forEach(entry => {
            if (entry.anchor_element) {
                // add entries event listeners
                entry.anchor_element.addEventListener("click", function(e) {
                    $this.config.navigation_onclick_callback(entry, e);
                    $this.nav_entries.set_current_page_class(entry.key, $this.config.navigation_current_class);
                });
            }
        });
    }

    update (nav_entries) {
        let padding = window.innerHeight * this.config.threshold;

        nav_entries.entries.forEach(entry => {

            if (entry.key) {
                let domRect = entry.heading_container.getBoundingClientRect();

                if (typeof domRect.height !== "undefined" && domRect.height <= padding) {
                    padding *= domRect.height / padding - 0.1; // adjust the threshold
                }

                if (domRect.top - padding <= 0 && domRect.bottom - padding >= 0) {
                    if (nav_entries.set_current_page_class(entry.key, this.config.navigation_current_class))
                        this.config.navigation_onupdate_callback(entry);
                }
            }

        });
    }

    find_nav_entries (li_elements) {
        let nav_entries = new NavEntries();
        let nav_li_elements = document.querySelectorAll(li_elements);

        nav_li_elements.forEach(li_element => {
            let anchor_element = li_element;
            if (anchor_element.tagName !== "A") {
                anchor_element = li_element.querySelector("a");
            }

            let key = anchor_element.href.split("#")[1];

            if (li_element.classList.contains(this.config.navigation_current_class)) {
                key = this.config.home_anchor;
                anchor_element.href += "#" + this.config.home_anchor;
            }

            let heading_element = document.querySelector("#" + key);
            let heading_container = AnchorNavigation.querySelectorParent(heading_element, this.config.heading_container);

            if (!heading_container) {
                heading_container = heading_element;
            }

            if (key && heading_element) {
                nav_entries.add(key, li_element, anchor_element, heading_element, heading_container);
            }
        });

        return nav_entries;
    }

    static querySelectorParent (elm, selector) {
        while (elm) {
            elm = elm.parentElement;
            if (elm && elm.matches(selector)) {
                return elm;
            }
        }
        return false;
    }

    static extend (...args) {
        for(let i=1; i<args.length; i++)
            for(let key in args[i])
                if(args[i].hasOwnProperty(key)) {
                    if (AnchorNavigation.is_dictionary(args[i][key]))
                        args[0][key] = AnchorNavigation.extend(args[0][key], args[i][key]);
                    else
                        args[0][key] = args[i][key];
                }
        return args[0];
    }

    static is_dictionary (variable) {
        return typeof variable === "object" && variable!==null && !(variable instanceof Array) && !(variable instanceof Date);
    }

    static buildThresholdList (steps=10) {
        let thresholds = [.0];
        for (let i=1.0; i<=steps; i++) {
            let ratio = i/steps;
            thresholds.push(ratio);
        }
        return thresholds;
    }
}

class NavEntries {
    constructor (options) {
        this.entries = [];
        this.current_key = undefined;
    }

    push (nav_entry) {
        if (nav_entry instanceof NavEntry)
            this.entries.push(nav_entry);
    }

    add (key, list_element, anchor_element, heading_element, heading_container) {
        let nav_entry = new NavEntry(key, list_element, anchor_element, heading_element, heading_container);
        this.push(nav_entry);
    }

    find (key) {
        return this.entries.find(function (elm) {
            return elm.key === key;
        });
    }

    set_current_page_class (key, class_name) {
        if (this.current_key === key) {
            return false;
        }

        if (!Array.isArray(class_name)) {
            class_name = [class_name];
        }

        this.entries.map(entry => entry.list_element.classList.remove(class_name));
        let entry = this.find(key);

        if (!entry) {
            return false;
        }

        entry.list_element.classList.add(class_name);

        this.current_key = key;

        return true;
    }
}

class NavEntry {
    constructor (key, list_element, anchor_element, heading_element, heading_container) {
        this.key = key; // anchor without hash for identification
        this.list_element = list_element; // the list element with the current page class e.g <li>
        this.anchor_element = anchor_element; // the anchor element with the url e.g <a>
        this.heading_element = heading_element; // anchor destination
        this.heading_container = heading_container; // container that contains the heading element
    }
}


// jQuery Integration
if (typeof jQuery !== 'undefined')
(function($) {

    $.fn.anchorNavigation = function(options={}) {
        let anchor_nav = new AnchorNavigation(this.selector ? this.selector : this[0], options);
        return this;
    };

})(jQuery);