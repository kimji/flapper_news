var news = angular.module('flapperNews', ['ui.router']);

news.config([
	'$stateProvider'
	,'$urlRouterProvider'
	,function($stateProvider, $urlRouterProvider){
		$stateProvider.state('home', {
			url : '/home'
			,templateUrl : '/home.html'
			,controller : 'MainCtrl'
			,resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		}).state('posts', {
			url : '/posts/{id}'
			,templateUrl : '/posts.html'
			,controller : 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
]);

news.factory('posts', [ '$http', function($http){
	var o = {
		posts : [
			{id : 0, title : 'post1', upvotes : 5, comments : Array()}
			,{id : 1, title : 'post2', upvotes : 2, comments : Array()}
			,{id : 2, title : 'post3', upvotes : 15, comments : Array()}
			,{id : 3, title : 'post4', upvotes : 9, comments : Array()}
			,{id : 4, title : 'post5', upvotes : 4, comments : Array()}
		]
	};

	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};

	o.create = function(post){
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		});
	};

	o.get = function(id){
		return $http.get('/posts/'+id).success(function(data){

		});
	};

	o.upvote = function(post){
		return $http.put('/posts/'+post._id+'/upvote').success(function(data){
			post.upvotes += 1;
		});
	};

	return o;
}]);

news.controller('MainCtrl', [ '$scope', 'posts', function($scope, posts){
	$scope.posts = posts.posts;

	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return; }
		posts.create({
			title : $scope.title
			,link : $scope.link
			,upvotes : 0
			,comments : [
				{author:'Joe', body:'Cool post!', upvotes:0}
				,{author:'Bob', body:'Great idea but everything is wrong!', upvotes:0}
			]
		});
		$scope.title = '';
		$scope.link = '';
	}

	$scope.incrementUpvotes = function(post){
		posts.upvote(post);
	}
}]);

news.controller('PostsCtrl', [ '$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id];

	$scope.addComment = function(){
		if($scope.body===''){ return; }
		$scope.post.comments.push({
			author : 'user'
			,body : $scope.body
			,upvotes : 0
		});
		$scope.body = '';
	}
}]);
