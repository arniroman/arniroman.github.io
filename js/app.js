/*-- module init --*/
let app = angular.module('app', ['ngRoute']);
/*-- routing --*/
app.config(['$routeProvider', function($routeProvide) {
    $routeProvide
        .when('/', {
            templateUrl: 'template/home.html'
        })
        .when('/home', {
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
app.controller('postsHomeCtrl', function($scope, _save, _read) {
    $scope.list = _read()
    $scope.removedPost = function(list) {
        $scope.list.forEach(function(elem, index) {
            if (elem.id == list.id) {
                $scope.list.splice(index, 1)
                _save($scope.list)
            }
        });
    }
})

/*-- create posts controller --*/
app.controller('createPostCtrl', function($scope, _save, _read) {
    $scope.list = _read()
    $scope.ID = function() {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    $scope.newPostBtn = function() {
        if ($scope.newlistPost != undefined) {
            $scope.list.push({
                id: $scope.ID(),
                name: $scope.newlistPost,
                removed: true,
                coment: []
            })
        }
        _save($scope.list)
    }
    $scope.data = $scope.list
})

/*-- create coments controller --*/
app.controller('createCommentsCtrl', function($scope, $routeParams, _save, _read) {
    $scope.list = _read()
    let postId = $routeParams.postId
    $scope.post = _.find($scope.list, { id: postId })
    $scope.addNewComent = function() {
        $scope.list.filter(function(elem) {
            if (elem.id == postId && $scope.newComment != undefined) {
                elem.coment.push($scope.newComment)
                _save($scope.list)
            }
        })
    }
})

/*-- functions fabric for save in local storage --*/
app.factory('_save', function() {
    return function _save(data) {
        window.localStorage["tasks"] = JSON.stringify(data, function(key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val
        });
    }
})

app.factory('_read', function() {
    return function _read(data) {
        var temp = window.localStorage["tasks"]
        if (!temp) data = [];
        else data = JSON.parse(temp);
        return data;
    }
})