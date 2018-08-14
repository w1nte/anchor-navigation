// if (!('IntersectionObserver' in window)) {

var Anchor_Navigation = function(config = null) {

    var $this = this;

    this.default_config = {
        "navigation_entries": "#navigation li",
        "navigation_current_class": "current",
        "home_anchor": "home",
        "onclick_callback": function(e) {
            console.log(":)");
        }
    };
    this.config = {};

    this.init = function(config) {
        $this.config = $this.extend({}, $this.default_config, config);
        var nav_entries = this.find_nav_entries($this.config["navigation_entries"]);


        var observer;
        var options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        };

        var callback = function(entries, observer) {

            entries.forEach(entry => {
                if (entry.intersectionRatio >= 1) {
                    var nav_entry = nav_entries.find(entry.target.id);

                    nav_entries.entries.forEach(entry => { entry.li_element.classList.remove($this.config["navigation_current_class"]); });
                    nav_entry.li_element.classList.add($this.config["navigation_current_class"]);
                }
            });
        };

        observer = new IntersectionObserver(callback, options);

        nav_entries.entries.forEach(entry => {
            if (entry.anchor) {
                var boxElement = document.querySelector("#" + entry.anchor);
                if (boxElement)
                    observer.observe(boxElement);

                entry.anchor_element.addEventListener("click", function(e) {
                    $this.config["onclick_callback"](e);
                });
            }
        });
    };

    // class
    this.Nav_entry = function(anchor, li_element, anchor_element) {
        this.anchor = anchor; // anchor without hash symbol
        this.li_element = li_element; // list element e.g <li>
        this.anchor_element = anchor_element; // anchor element e.g <a>
    };

    // class
    this.Nav_entries = function() {
        this.entries = [];

        this.push = function(nav_entry) {
            if (nav_entry instanceof $this.Nav_entry)
                this.entries.push(nav_entry);
        };

        this.add = function(anchor, li_element, anchor_element) {
            var nav_entry = new $this.Nav_entry(anchor, li_element, anchor_element);
            this.push(nav_entry);
        };

        this.find = function(anchor) {
            var result = false;
            this.entries.forEach(entry => {
                if (entry.anchor === anchor)
                    result = entry;
            });
            return result;
        };
    };

    this.find_nav_entries = function(li_elements) {
        var nav_entries = new $this.Nav_entries();
        var nav_li_elements = document.querySelectorAll(li_elements);

        nav_li_elements.forEach(li_element => {
            var anchor_element = li_element;
            if (li_element.tagName !== "A")
                anchor_element = li_element.querySelector('a');

            var anchor = anchor_element.href.split("#")[1];
            if (!anchor)
                anchor = $this.config['home_anchor'];
            nav_entries.add(anchor, li_element, anchor_element);
        });

        return nav_entries;
    };

    this.setup_observer = function() {

    };

    this.is_dictionary = function (variable) {
        return typeof variable === 'object' && variable!==null && !(variable instanceof Array) && !(variable instanceof Date)
    };

    this.extend = function(...args) {
        for(let i=1; i<args.length; i++)
            for(let key in args[i])
                if(args[i].hasOwnProperty(key)) {
                    if ($this.is_dictionary(args[i][key]))
                        args[0][key] = this.extend(args[0][key], args[i][key]);
                    else
                        args[0][key] = args[i][key];
                }
        return args[0];
    };

    this.init(config);

};

(function($) {

    var anchor_nav = new Anchor_Navigation({});

})(jQuery);