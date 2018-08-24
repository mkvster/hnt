// hntApp.js
(function () {
    "use strict";
    angular.module("HntApp", ["ngSanitize"])
        .constant("baseUrl", $("#apiUrl").first().attr("data-api-url"))
        .run(["baseUrl", function (baseUrl) {
            console.log("HNT API url: " + baseUrl);
        }]);
})();
