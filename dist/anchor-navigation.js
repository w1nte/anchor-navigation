"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INTERSECTION_OBSERVER = "IntersectionObserver" in window;
//const INTERSECTION_OBSERVER = false; // debug


var AnchorNavigation = function () {
    function AnchorNavigation(navigation_entries, config) {
        _classCallCheck(this, AnchorNavigation);

        var $this = this;

        this.defaultConfig = {
            "navigation_entries": "#navigation li",
            "navigation_current_class": "current",
            "home_anchor": "home",
            "onclick_callback": function onclick_callback(e) {}
        };
        this.config = this.extend({}, this.defaultConfig, { "navigation-entries": navigation_entries }, config);

        var nav_entries = this.find_nav_entries(this.config["navigation_entries"]);

        var observer = this.register_observer(function (entry) {
            nav_entries.set_current_page_class(entry.id, $this.config["navigation_current_class"]);
        });

        if (!observer) {
            // fallback
            var si = 0,
                scroll_precision = 5;
            window.addEventListener("scroll", function () {
                si++;
                if (si > scroll_precision) {

                    nav_entries.entries.forEach(function (entry) {
                        if (entry.key) {
                            var anchorDest = document.querySelector("#" + entry.key);
                            if (anchorDest) {
                                var domRect = anchorDest.getBoundingClientRect();
                                if (domRect.top < window.innerHeight && domRect.top > 0) nav_entries.set_current_page_class(anchorDest.id, $this.config["navigation_current_class"]);
                            }
                        }
                    });

                    si = 0;
                }
            });
        }

        nav_entries.entries.forEach(function (entry) {
            if (entry.key) {
                var anchorDest = document.querySelector("#" + entry.key);

                // observe elements
                if (anchorDest && observer) observer.observe(anchorDest);

                // add entries event listeners
                entry.anchor_element.addEventListener("click", function (e) {
                    $this.config["onclick_callback"](e);
                });
            }
        });
    }

    _createClass(AnchorNavigation, [{
        key: "register_observer",
        value: function register_observer(callback) {
            if (!INTERSECTION_OBSERVER) return false;

            var observer = void 0;

            var options = {
                root: null,
                rootMargin: "0px",
                threshold: 1
            };

            var cb = function cb(entries, observer) {

                entries.forEach(function (entry) {
                    if (entry.intersectionRatio >= 1) {
                        callback(entry.target);
                    }
                });
            };

            observer = new IntersectionObserver(cb, options);

            return observer;
        }
    }, {
        key: "find_nav_entries",
        value: function find_nav_entries(li_elements) {
            var _this = this;

            var nav_entries = new NavEntries();
            var nav_li_elements = document.querySelectorAll(li_elements);

            nav_li_elements.forEach(function (li_element) {
                var anchor_element = li_element;
                if (li_element.tagName !== "A") anchor_element = li_element.querySelector("a");

                var anchor = anchor_element.href.split("#")[1];
                if (li_element.classList.contains(_this.config["navigation_current_class"])) {
                    anchor = _this.config["home_anchor"];
                    anchor_element.href += "#" + _this.config["home_anchor"];
                }
                if (anchor) nav_entries.add(anchor, li_element, anchor_element);
            });

            return nav_entries;
        }
    }, {
        key: "extend",
        value: function extend() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            for (var i = 1; i < args.length; i++) {
                for (var key in args[i]) {
                    if (args[i].hasOwnProperty(key)) {
                        if (AnchorNavigation.is_dictionary(args[i][key])) args[0][key] = this.extend(args[0][key], args[i][key]);else args[0][key] = args[i][key];
                    }
                }
            }return args[0];
        }
    }], [{
        key: "is_dictionary",
        value: function is_dictionary(variable) {
            return (typeof variable === "undefined" ? "undefined" : _typeof(variable)) === "object" && variable !== null && !(variable instanceof Array) && !(variable instanceof Date);
        }
    }]);

    return AnchorNavigation;
}();

var NavEntries = function () {
    function NavEntries(options) {
        _classCallCheck(this, NavEntries);

        this.entries = [];
    }

    _createClass(NavEntries, [{
        key: "push",
        value: function push(nav_entry) {
            if (nav_entry instanceof NavEntry) this.entries.push(nav_entry);
        }
    }, {
        key: "add",
        value: function add(key, list_element, anchor_element) {
            var nav_entry = new NavEntry(key, list_element, anchor_element);
            this.push(nav_entry);
        }
    }, {
        key: "find",
        value: function find(key) {
            return this.entries.find(function (elm) {
                return elm.key === key;
            });
        }
    }, {
        key: "set_current_page_class",
        value: function set_current_page_class(key, class_name) {
            this.entries.map(function (entry) {
                return entry.list_element.classList.remove(class_name);
            });
            this.find(key).list_element.classList.add(class_name);
        }
    }]);

    return NavEntries;
}();

var NavEntry = function NavEntry(key, list_element, anchor_element) {
    _classCallCheck(this, NavEntry);

    this.key = key; // anchor without hash for identification
    this.list_element = list_element; // the list element with the current page class e.g <li>
    this.anchor_element = anchor_element; // the anchor element with the url e.g <a>
};

// jQuery Integration


if (typeof jQuery !== 'undefined') (function ($) {

    $.fn.anchorNavigation = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var anchor_nav = new AnchorNavigation(this[0], options);
        return this;
    };
})(jQuery);