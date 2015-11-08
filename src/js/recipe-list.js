;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($rootScope, $scope, $http, $routeParams, $location){
          var username = $routeParams.username;

          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
              $scope.username = username;
              // var currentRating = $scope.recipes.rating;
              // var currentRating = 1;
              // console.log(currentRating)
              $scope.rating = 0;
              $scope.ratings = [{
                  // current: currentRating,
                  max: 5
              }];
            })

          $scope.listBrewIt = function(username, id){
            //get indexOf recipe id
            for (var index = 0; index < $scope.recipes.length; index ++) {
              if($scope.recipes[index].id == id){
                var recipeId = index;
              }
            }
            $rootScope.steps = $scope.recipes[recipeId].steps;
            $rootScope.detail = $scope.recipes[recipeId];
            $location.path("/users/" + username + "/recipes/" + id + "/brewit")
            $(document).scrollTop(0);
          }//end listBrewit function

          $scope.rateRecipe = function (rating, id) {
            var newRating = {"rating": rating}
            console.log(newRating)
            console.log("new rating = " + newRating.rating)
            console.log(username)
            console.log(id)
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/", newRating).then(function(){
              console.log("yay rating updated")
            })
          }

      })//end controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
