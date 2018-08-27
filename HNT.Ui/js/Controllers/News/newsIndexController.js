// newsIndexController.js
(function () {
    "use strict";

    var newsIndexController = function (baseUrl, newsRepository) {

        this.webApiUrl = baseUrl + "api/news/";
        this.newsListName = "newstories";
        this.pageSize = 50;
        this.pageNumber = 0;
        this.isOnLastPage = false;
        this.newsList = [];
        this.inProgress = false;
        this.inNewsFeedChange = false;

        this.newsFeedInfoList = [
            { name: "New Stories", id: "newstories" },
            { name: "Top Stories", id: "topstories" },
            { name: "Ask Stories", id: "askstories" },
            { name: "Show Stories", id: "showstories" },
            { name: "Job Stories", id: "jobstories" },
        ];
        this.selectedNewsFeedInfo = this.newsFeedInfoList[0];

        this.getMoreNewsText = function () {
            var vm = this;
            if (vm.isOnLastPage) {
                return "Reload List...";
            }
            var start = vm.newsList.length + 1;
            var end = (vm.pageSize * vm. pageNumber) + vm.pageSize;
            return "Load Items " + start + " - " + end + " ...";
        };

        this.selectedNewsFeedInfoChanged = function () {
            var vm = this;
            vm.newsListName = vm.selectedNewsFeedInfo.id;
            vm.reset();
            vm.inNewsFeedChange = true;
            vm.loadMore();
        }

        this.finishAjax = function () {
            var vm = this;
            vm.inProgress = false;
            if (vm.inNewsFeedChange) {
                vm.loadMore();
            }
        }

        this.toggleChildren = function (data) {
            if (!data.kids) {
                return;
            }
            if (data.childrenVisible) {
                return;
            }
            var vm = this;
            if (vm.inProgress) {
                return;
            }
            vm.inProgress = true;
            data.childrenVisible = !data.childrenVisible;
            newsRepository.getNewsKids(data.id).then(
                // success
                function (response) {
                    data.children = response.data;
                    vm.finishAjax();
                },
                // failed
                function (result) {
                    console.log('getNewsKids failed');
                    console.log(result);
                    vm.finishAjax();
                });
        };

        this.reset = function() {
            var vm = this;
            vm.newsList = [];
            vm.pageNumber = 0;
            vm.isOnLastPage = false;
            vm.inNewsFeedChange = false;
        };

        this.loadMore = function () {
            var vm = this;
            if (vm.inProgress) {
                return;
            }
            vm.inProgress = true;
            if (vm.isOnLastPage || vm.inNewsFeedChange) {
                vm.reset();
            }
            newsRepository.getNewsList(vm.newsListName, vm.pageSize, vm.pageNumber).then(
                // success
                function (response) {
                    vm.pageNumber += 1;
                    vm.isOnLastPage = response.data.length == 0;
                    if (!vm.isOnLastPage && !vm.inNewsFeedChange) {
                        vm.newsList.push.apply(vm.newsList, response.data);
                    }
                    vm.finishAjax();
                },
                // failed
                function (result) {
                    console.log('getNewsList failed');
                    console.log(result);
                    vm.finishAjax();
                });

        };

        this.init = function () {
            this.loadMore();
        }

        this.init();
    }

    newsIndexController.$inject = ["baseUrl", "newsRepository"];
    var module = angular.module("HntApp");
    module.controller("newsIndexController", newsIndexController);
})();
