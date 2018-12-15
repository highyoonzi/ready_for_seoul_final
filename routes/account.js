module.exports = function(app, conn){
	var express = require('express');
	var router = express.Router();
	var md5 = require('md5');

	router.get('/login', (req, res) => {
		res.render('user/login')
	})
	router.post('/login', (req, res) => {
		var email = req.body.email;
		var password = req.body.password;

		/* Check duplicate */
		var sql = 'SELECT * FROM user WHERE email = ?'
		conn.query(sql, [email], function(err, result, fields){
			if (err) {
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err);
			} else {
				if (result.length != 1) {
					res.status(500).send('Non exist user');
				} else {
				/* Password match */
					if (md5(password) != result[0].password) {
						res.status(500).send('Incorrect password');
					} else {
						req.session.user = {
							'email': result[0].email,
							'isAdmin': result[0].is_admin
						}
					res.redirect('/');
					}
				}
			}
		})
	})

	router.get('/logout', (req, res) => {
		var sess = req.session;
		if(sess.user){
			req.session.destroy(function(err){
				if (err){
					console.log(err);
				} else {
					res.redirect('/');
				}
			});
		}
		res.redirect('/');
	});

	router.get('/signup', (req, res) => {
		res.render('user/signup')
	})
	router.post('/signup', (req, res) => {
		var email = req.body.email;
		var username = req.body.username;
		var address = req.body.address;
		var birth_date = req.body.birth_date;
		var password = req.body.password;

		/* Check duplicate */
		var sql = 'SELECT COUNT(*) as cnt FROM user WHERE email = ?'
		conn.query(sql, [email], function(err, result, fields){
			if (err) {
				console.log(err);
				res.status(500).send('Internal Server Error: ' + err);
			} else if (result[0].cnt > 0) {
				console.log(err);
				res.status(500).send('Duplicated email: ' + email);
			} else {
				/* password hash */
				var hashed_password = md5(password);

				var sql = 'INSERT INTO user (`email`, `username`, `password`, `address`, `birthdate`, `inserted`) VALUES (?, ?, ?, ?, ?, now())';
				conn.query(sql, [email, username, hashed_password, address, birth_date], function(err, result, fields){

					if(err){
						console.log(err);
						res.status(500).send('Internal Server Error: ' + err);
					} else {
						var sql = 'SELECT * from user WHERE id = ?';
						conn.query(sql, [result.insertId], function(err, users, fields){
							if(err) {
								console.log(err);
								res.status(500).send('Internal Server Error');
							}
								res.render('index', {
								user: users[0]
							});
						});
					}

				});
			}
		});
	})
	return router
}