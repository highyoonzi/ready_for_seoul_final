module.exports = function(app, conn){
	var express = require('express');
	var router = express.Router();
	var md5 = require('md5');

	router.get('/', (req, res) => {
		res.render('shop/list')
	})
	router.get('/:id', (req, res) => {
		res.render('shop/detail', {
			'message': req.params.id
		})
	})
	
	return router
}