// newsRepository.js
(function () {
    "use strict";
    var newsRepository = function ($http, $q, baseUrl) {

        var startHttp = function (method, action) {
            var httpConfig = {
                method: method,
                url: baseUrl + action,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,
            };
            return $http(httpConfig);
        };

        var startNewsGet = function (action) {
            return startHttp('GET', "api/news/" + action);
        };

        var getNewsList = function (listName, pageSize, pageNumber) {
            return startNewsGet(listName + "/" + pageSize +"/" + pageNumber);
        };

        var getNewsKids = function (id) {
            return startNewsGet(id + "/kids");
        };

        var getNews = function (id) {
            return startNewsGet(id);
        };

        return {
            getNewsList: getNewsList,
            getNewsKids: getNewsKids,
            getNews: getNews
        };
    };

    newsRepository.$inject = ["$http", "$q", "baseUrl"];
    var module = angular.module("HntApp");
    module.factory('newsRepository', newsRepository);
})();