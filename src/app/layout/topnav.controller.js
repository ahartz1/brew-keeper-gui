(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('TopNavController', TopNavController);

  TopNavController.$inject = [
    '$rootScope',
    'dataService',
    'recipeService'
  ];

  function TopNavController($rootScope, dataService, recipeService) {
    $rootScope.maxStars = 5;

    var vm = this;
    vm.logout = logout;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the nav bar.
     */
    function activate() {
      var cookie = dataService.getCredentials();
      dataService.setCredentials(cookie, true);

      dataService.get('/api/whoami/')
        .then(function(response) {
          // If the user still has valid credentials, ensure rootScope has
          // their username
          $rootScope.username = response.data.username;
        })
        .catch(function(error) {
          $rootScope.username = null;
          dataService.clearCredentials();
          recipeService.clearAllCache();
        });

      // Show/hide hamburger
      $(".menu").on('click', function() {
        $('.menu').toggleClass("active");
      });

      // Hide the menu if the user clicks somewhere not on the menu
      $(document).on('click', function(e) {
        if (!$(e.target).is('.menu.active')) {
          $('.menu').removeClass("active");
        }
      });
    }

    /**
     * Log the user out, updating what is visible in the UI.
     */
    function logout() {
      var cookie = dataService.getCredentials();
      var logoutHeader = {"Authorization": cookie};

      // Log the user out of the back-end API
      dataService.post('/api/logout/', logoutHeader)
        .then(function() {
          $rootScope.username = null;
          dataService.clearCredentials();
          recipeService.clearAllCache();
        });
    }
  }
})();
