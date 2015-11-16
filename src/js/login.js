;(function(){ //IIFE for angular
angular.module('brewKeeper')
  .controller('signupController', function($scope, $http, $cookies, $location){
    $scope.users = {}
    $scope.signupButton = function(mismatch) {
      if(mismatch){
          $(".wrapper").addClass("openerror");
          $("section.register-modal").removeClass("inactive");
        $("button.password-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.register-modal").addClass("inactive");
        });
        return
      }



      $http.post('https://brew-keeper-api.herokuapp.com/api/register/', $scope.users)
      .then(function successCallback(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = { }
        $location.path('/')
      }, function errorCallback(response){
        alert("Please fill out all fields carefully.");
      })//Response if bad signup attempt
    };



  })//END CONTROLLER FOR SIGNUP


  .controller('loginCtrl', function($scope, $http, $rootScope, $cookies, $location){//CONTROLLER FOR LOGIN

    $scope.users = {}
    $scope.loginButton= function(){
      $cookies.remove("Authorization")
      $http.defaults.headers.common = {}
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function successCallback(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.username = $scope.users.username
        $scope.users = {};
        $location.path('/')
      }, function errorCallback(response){
//Below is entering register mismatch modal test
          $(".wrapper").addClass("openerror");
          $("section.login-modal").removeClass("inactive");
        $("button.login-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.login-modal").addClass("inactive");
        });
//Above is exiting register mismatch modal text.

      })//responses for bad login attempts
    }//submit function
    $('.show-signup').on('click', function(){
      $('section.register').removeClass('hidden');
      $('form.login').addClass('hidden')
    })//show signup form

    
  })//END CONTROLLER FOR LOGIN



  .controller('changePassword', function($scope, $http, $location, $cookies, $rootScope){
    var users = {}
    $scope.resetError = false;
    $scope.resetSuccess = false;
    $scope.generalError = false;


    $scope.submitChangePassword = function(mismatch){
      if(mismatch){
//Below is entering register mismatch modal test
          $(".wrapper").addClass("openerror");
          $("section.register-modal").removeClass("inactive");
//Above is modal text.  line below is what it's replacing.
        // alert("Passwords Do Not Match")
//Below is exiting register mismatch modal test
        $("button.password-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.register-modal").addClass("inactive");
        });
//Above is existing register mismatch modal text.
       return
      }
      users.username = $scope.username;
      users.old_password = $scope.users.old_password;
      users.new_password = $scope.users.new_password;
      $http.post('https://brew-keeper-api.herokuapp.com/api/change-pw/', users)
        .then(function successCallback(){
//Below is entering register mismatch modal test
          $(".wrapper").addClass("openerror");
          $("section.successful-modal").removeClass("inactive");
//Above is modal text.  line below is what it's replacing.
        // alert("Passwords Do Not Match")
//Below is exiting register mismatch modal test
        $("button.change-not-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.successful-modal").addClass("inactive");
        })
          $location.path('/');
//Above is existing register mismatch modal text.
        },
        function errorCallback(){
          $(".wrapper").addClass("openerror");
          $("section.password-modal").removeClass("inactive");
//Above is modal text.  line below is what it's replacing.
        // alert("Passwords Do Not Match")
//Below is exiting register mismatch modal test
        $("button.password-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.password-modal").addClass("inactive");
        })
          $scope.users = {};
        })//end http.post to change-pw
    } //end submitChangePassword function

    $('.show-reset').on('click', function(){
      console.log("reset password button pressed")
      $('.reset-password').removeClass('hidden');
      $('form.login').addClass('hidden')
    });

    $(".login-link").click(function(){
      console.log("login link from change password controller")
      $('section.register').addClass('hidden');
      $('form.login').removeClass('hidden');
      $('section.reset-password').addClass('hidden');
    })

    $scope.requestReset = function(users){
      $scope.resetError = false;
      $scope.resetSuccess = false;
      $scope.generalError = false;
      $http.post('https://brew-keeper-api.herokuapp.com/api/get-reset/', $scope.users)
        .then(function(response){
          if(response.data){
            $scope.resetError = true;
            return
          };
          $scope.resetSuccess = true;
        })
        .catch(function(){
          $scope.generalError = true;
        })
    };//end requestReset function

    $scope.resetPassword = function(mismatch){
      // console.log("resetPassword function")
      // console.log($scope.users)
      // console.log(mismatch)
      if(mismatch){
        alert("Passwords Do Not Match")
        return
      }
      users.username = $scope.users.username;
      users.reset_string= $scope.users.reset_string;
      users.email = $scope.users.email;
      users.new_password = $scope.users.new_password;
      // console.log(users)
      $http.post('https://brew-keeper-api.herokuapp.com/api/reset-pw/', users)
        .then(function(response){
          // console.log("success")
          // console.log(response);
          userInfo = "Token " + response.data.token;
          $cookies.put("Authorization", userInfo);
          $http.defaults.headers.common = {"Authorization": userInfo};
          $scope.username = $scope.users.username;
          $scope.users = {};
          $location.path('/');
        })//end .then
        .catch(function(response){
          $rootScope.errorMessage = response.data
          // alert(response.data);
        })//end .catch
    }; //end resetPassword function


  })//end changePassword controller
})();//END IFFE
