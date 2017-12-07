/*-- module init --*/
let app = angular.module('app', ['ngRoute']);
/*-- routing --*/
app.config(['$routeProvider', function($routeProvide) {
    $routeProvide
        .when('/', {
            templateUrl: 'template/home.html'
        })
        .when('/create', {
            templateUrl: 'template/create.html'
        })
        .when('/:postId', {
            templateUrl: 'template/comment.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

/*-- list home controller --*/
app.controller('postsHomeCtrl', function($scope, save, read) {
    $scope.list = read()
    $scope.removedPost = function(list) {
        $scope.list.forEach(function(elem, index) {
            if (elem.id == list.id) {
                $scope.list.splice(index, 1)
                save($scope.list)
            }
        });
    }
})

/*-- create posts controller --*/
app.controller('createPostCtrl', function($scope, save, read) {
    $scope.list = read()
    $scope.ID = function() {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    $scope.newPostBtn = function() {
        if ($scope.newlistPost === undefined) return
        $scope.list.push({
            id: $scope.ID(),
            name: $scope.newlistPost,
            coment: []
        })
        save($scope.list)
    }
    $scope.data = $scope.list
})

/*-- create comments controller --*/
app.controller('createCommentsCtrl', function($scope, $routeParams, save, read) {
    $scope.list = read()
    let postId = $routeParams.postId
    $scope.post = _.find($scope.list, { id: postId })
    $scope.addNewComent = function() {
        $scope.list.filter(function(elem) {
            if (elem.id == postId && $scope.newComment != undefined) {
                elem.coment.push($scope.newComment)
                save($scope.list)
            }
        })
    }
})

/*-- functions fabric for save in local storage --*/
app.factory('save', () => {
    return (data) => {
        window.localStorage["tasks"] = JSON.stringify(data);
    }
})

app.factory('read', () => {
    return () => {
        let temp = window.localStorage["tasks"]
        if (!temp) return [];
        return JSON.parse(temp);
    }
})