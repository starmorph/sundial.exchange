(function (window, document) {
    if (window.twq) {
        return;
    }

    var twq = function () {
        if (twq.exe) {
            twq.exe.apply(twq, arguments);
        } else {
            twq.queue.push(arguments);
        }
    };

    twq.version = "1.1";
    twq.queue = [];

    var scriptElement = document.createElement("script");
    scriptElement.async = true;
    scriptElement.src = "https://static.ads-twitter.com/uwt.js";

    var firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(scriptElement, firstScript);

    window.twq = twq;

    twq("config", "qmzc7");
})(window, document);


