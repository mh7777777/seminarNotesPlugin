'use strict';

(function (angular, buildfire, window) {
  angular.module('seminarNotesPluginWidget')
    .controller('WidgetSearchCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'LAYOUTS', '$routeParams', '$sce', '$rootScope', 'Buildfire', 'ViewStack', 'UserData', 'PAGINATION',
      function ($scope, DataStore, TAG_NAMES, LAYOUTS, $routeParams, $sce, $rootScope, Buildfire, ViewStack, UserData, PAGINATION) {
        var WidgetSearch = this;

        WidgetSearch.items = [];

        WidgetSearch.searchOptions = {};

        var tmrDelay = null;
        /*
         * Call the datastore to save the data object
         */
        var searchData = function (newValue, tag) {
          var searchTerm = '';
          if (typeof newValue === 'undefined') {
            return;
          }
          var success = function (result) {
              console.info('Searched data result:=================== ', result);
              WidgetSearch.items = result;
            }
            , error = function (err) {
              console.error('Error while searching data : ', err);
            };
          if (newValue) {
            newValue = newValue.trim();
            if (newValue.indexOf(' ') !== -1) {
              searchTerm = newValue.split(' ');
              WidgetSearch.searchOptions.filter = {
                "$or": [{
                  "$json.title": {
                    "$regex": searchTerm[0],
                    "$options": "i"
                  }
                }, {
                  "$json.summary": {
                    "$regex": searchTerm[0],
                    "$options": "i"
                  }
                }, {
                  "$json.title": {
                    "$regex": searchTerm[1],
                    "$options": "i"
                  }
                }, {
                  "$json.summary": {
                    "$regex": searchTerm[1],
                    "$options": "i"
                  }
                }
                ]
              };
            } else {
              searchTerm = newValue;
              WidgetSearch.searchOptions.filter = {
                "$or": [{
                  "$json.title": {
                    "$regex": searchTerm,
                    "$options": "i"
                  }
                }, {"$json.summary": {"$regex": searchTerm, "$options": "i"}}]
              };
            }
          }
          DataStore.search(WidgetSearch.searchOptions, tag).then(success, error);
        };

        var saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              searchData(newObj, TAG_NAMES.SEMINAR_ITEMS);
            }, 500);
          }
        };

        $scope.$watch(function () {
          return WidgetSearch.keyword;
        }, saveDataWithDelay, true);

        WidgetSearch.clearSearchResult = function () {
          WidgetSearch.keyword = null;
          WidgetSearch.items = [];
        };

      }]);
})(window.angular, window.buildfire, window);

