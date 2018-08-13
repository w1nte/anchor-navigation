(function($) {

    var options = {
        root: document.querySelector('#scrollArea'),
        rootMargin: '0px',
        threshold: 1.0
    };

    var observer = new IntersectionObserver(callback, options);

})(jQuery);