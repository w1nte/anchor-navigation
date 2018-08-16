"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnchorNavigation = function () {
    function AnchorNavigation(navigation_list_elements, config) {
        _classCallCheck(this, AnchorNavigation);

        var $this = this;

        this.defaultConfig = {
            "navigation_list_elements": "#navigation li",
            "navigation_current_class": ["current"],
            "heading_container": "div, section, article",
            "home_anchor": "home",
            "threshold": 0.5,
            "timeout": 250, // debounce timeout
            "navigation_onclick_callback": function navigation_onclick_callback(entry, e) {},
            "navigation_onupdate_callback": function navigation_onupdate_callback(entry) {}
        };
        this.config = AnchorNavigation.extend({}, this.defaultConfig, { "navigation_list_elements": navigation_list_elements }, config);

        this.nav_entries = new NavEntries();

        this.update_nav_entries();
    }

    _createClass(AnchorNavigation, [{
        key: "update_nav_entries",
        value: function update_nav_entries() {
            var $this = this;

            this.nav_entries = this.find_nav_entries(this.config.navigation_list_elements);

            var is_scrolling = void 0;
            window.addEventListener("scroll", function () {
                window.clearTimeout(is_scrolling);
                is_scrolling = setTimeout(function () {

                    $this.update($this.nav_entries);
                }, $this.config.timeout);
            }, false);

            this.nav_entries.entries.forEach(function (entry) {
                if (entry.anchor_element) {
                    // add entries event listeners
                    entry.anchor_element.addEventListener("click", function (e) {
                        $this.config.navigation_onclick_callback(entry, e);
                        $this.nav_entries.set_current_page_class(entry.key, $this.config.navigation_current_class);
                    });
                }
            });
        }
    }, {
        key: "update",
        value: function update(nav_entries) {
            var _this = this;

            var padding = window.innerHeight * this.config.threshold;

            nav_entries.entries.forEach(function (entry) {

                if (entry.key) {
                    var domRect = entry.heading_container.getBoundingClientRect();

                    if (typeof domRect.height !== "undefined" && domRect.height <= padding) {
                        padding *= domRect.height / padding - 0.1; // adjust the threshold
                    }

                    if (domRect.top - padding <= 0 && domRect.bottom - padding >= 0) {
                        if (nav_entries.set_current_page_class(entry.key, _this.config.navigation_current_class)) _this.config.navigation_onupdate_callback(entry);
                    }
                }
            });
        }
    }, {
        key: "find_nav_entries",
        value: function find_nav_entries(li_elements) {
            var _this2 = this;

            var nav_entries = new NavEntries();
            var nav_li_elements = document.querySelectorAll(li_elements);

            nav_li_elements.forEach(function (li_element) {
                var anchor_element = li_element;
                if (anchor_element.tagName !== "A") {
                    anchor_element = li_element.querySelector("a");
                }

                var key = anchor_element.href.split("#")[1];

                if (li_element.classList.contains(_this2.config.navigation_current_class)) {
                    key = _this2.config.home_anchor;
                    anchor_element.href += "#" + _this2.config.home_anchor;
                }

                var heading_element = document.querySelector("#" + key);
                var heading_container = AnchorNavigation.querySelectorParent(heading_element, _this2.config.heading_container);

                if (!heading_container) {
                    heading_container = heading_element;
                }

                if (key && heading_element) {
                    nav_entries.add(key, li_element, anchor_element, heading_element, heading_container);
                }
            });

            return nav_entries;
        }
    }], [{
        key: "querySelectorParent",
        value: function querySelectorParent(elm, selector) {
            while (elm) {
                elm = elm.parentElement;
                if (elm && elm.matches(selector)) {
                    return elm;
                }
            }
            return false;
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
                        if (AnchorNavigation.is_dictionary(args[i][key])) args[0][key] = AnchorNavigation.extend(args[0][key], args[i][key]);else args[0][key] = args[i][key];
                    }
                }
            }return args[0];
        }
    }, {
        key: "is_dictionary",
        value: function is_dictionary(variable) {
            return (typeof variable === "undefined" ? "undefined" : _typeof(variable)) === "object" && variable !== null && !(variable instanceof Array) && !(variable instanceof Date);
        }
    }, {
        key: "buildThresholdList",
        value: function buildThresholdList() {
            var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

            var thresholds = [.0];
            for (var i = 1.0; i <= steps; i++) {
                var ratio = i / steps;
                thresholds.push(ratio);
            }
            return thresholds;
        }
    }]);

    return AnchorNavigation;
}();

var NavEntries = function () {
    function NavEntries(options) {
        _classCallCheck(this, NavEntries);

        this.entries = [];
        this.current_key = undefined;
    }

    _createClass(NavEntries, [{
        key: "push",
        value: function push(nav_entry) {
            if (nav_entry instanceof NavEntry) this.entries.push(nav_entry);
        }
    }, {
        key: "add",
        value: function add(key, list_element, anchor_element, heading_element, heading_container) {
            var nav_entry = new NavEntry(key, list_element, anchor_element, heading_element, heading_container);
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
            if (this.current_key === key) {
                return false;
            }

            if (!Array.isArray(class_name)) {
                class_name = [class_name];
            }

            this.entries.map(function (entry) {
                return entry.list_element.classList.remove(class_name);
            });
            var entry = this.find(key);

            if (!entry) {
                return false;
            }

            entry.list_element.classList.add(class_name);

            this.current_key = key;

            return true;
        }
    }]);

    return NavEntries;
}();

var NavEntry = function NavEntry(key, list_element, anchor_element, heading_element, heading_container) {
    _classCallCheck(this, NavEntry);

    this.key = key; // anchor without hash for identification
    this.list_element = list_element; // the list element with the current page class e.g <li>
    this.anchor_element = anchor_element; // the anchor element with the url e.g <a>
    this.heading_element = heading_element; // anchor destination
    this.heading_container = heading_container; // container that contains the heading element
};

// jQuery Integration


if (typeof jQuery !== 'undefined') (function ($) {

    $.fn.anchorNavigation = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var anchor_nav = new AnchorNavigation(this.selector ? this.selector : this[0], options);
        return this;
    };
})(jQuery);