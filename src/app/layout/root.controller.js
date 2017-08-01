(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RootController', RootController);

  RootController.$inject = [
    '$location',
    '$rootScope',
    'dataService',
    'recipeService'
  ];

  function RootController($location, $rootScope, dataService, recipeService) {
    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      dataService.get('/api/whoami/')
        .then(function(response) {
          $rootScope.username = response.data.username;
          $location.path('/users/' + $rootScope.username + '/recipes');
        })
        .catch(function(error) {
          $rootScope.username = null;
          dataService.clearCredentials();
          recipeService.clearAllCache();
          $location.path('/public');
        });
    }
  }
})();