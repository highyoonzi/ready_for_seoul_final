module.exports = function(app, conn){
	var express = require('express');
	var router = express.Router();
	var md5 = require('md5');

	router.get('/', (req, res) => {
		var sql = 'SELECT * FROM qna';
		conn.query(sql, [], function(err, qna, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err);
			}
			else{
				res.render('qna/list', {
					'qna': qna
				})
			}
		})
	})

	router.get('/add', (req, res) => {
		res.render('qna/add')
	})
	router.post('/add', (req, res) => {
		var title = req.body.title;
		var text = req.body.text;
		var sql = 'INSERT INTO qna (`title`, `text`, `inserted`, `updated`) VALUES(?, ?, now(), now())';
		conn.query(sql, [title, text], function(err, result, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err)
			}
			else{
				res.redirect('/qna/' + result.insertId);
			}
		})
	})
	router.get('/:id', (req, res) => {
		var id = req.params.id;
		var sql = 'SELECT * FROM qna WHERE id=?';
		conn.query(sql, [id], function(err, qnas, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err);
			}
			else{
				res.render('qna/detail', {
					id:id,
					qna:qnas[0]
				})
			}
		})
	})

	router.get('/:id/edit', (req, res) => {
		res.render('qna/edit', {
			'message': req.params.id
		})
	})

	/* 아직 미구현 */
	router.post('/:id/edit', (req, res) => {
		res.redirect('/qna' + req.params.id)
	})


	router.get('/:id/delete', (req, res) => {
		var id = req.params.id;
		var sql = 'DELETE FROM qna WHERE id = ?';
		conn.query(sql, [id], function(err, result, fields){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err);
			}
			else{
				res.redirect('/qna')
			}
		})
		res.redirect('/qna')
	})

	return router
}
