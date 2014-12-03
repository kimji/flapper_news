var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


/* GET get post list */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts){
		if(err){ return next(err); }

		res.json(posts);
	});
});

/* POST insert post */
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);
	console.log(post);

	post.save(function(err, post){
		if(err){ return next(err); }

		res.json(post);
	});
});

/* Make Param for post */
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find post")); }

		req.post = post;
		return next();
	});
});

/* GET get post by post id */
router.get('/posts/:post', function(req, res) {
	req.post.populate('comments', function(err, post) { //연결된 코멘트도 불러옴
		res.json(post);
	});
});

/* PUT add upvote by post id */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/* POST insert comment by post id */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err){ return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err){ return next(err); }

			res.json(comment);
		});
	});
});

/* GET get comment list by post id */
router.get('/posts/:post/comments', function(req, res, next) {
	Comment.find(function(err, comments){
		if(err){ return next(err); }

		res.json(comments);
	});
});

/* Make Param for comment */
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error("can't find comment")); }

		req.comment = comment;
		return next();
	});
});

/* GET get comment by comment id */
router.get('/comments/:comment', function(req, res) {
	res.json(req.comment);
});

/* PUT add upvote by post id */
router.put('/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
