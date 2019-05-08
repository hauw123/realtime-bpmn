const express = require('express');
const M_user = require('../models/user');
const M_project = require('../models/project');
const M_friend = require('../models/friendship');
const router = express.Router();



const mongoose = require('mongoose');

const path = require('path');
const UserSession = require('../models/UserSession');

const jwt = require('jsonwebtoken');
const config = require('../config.js');
const passport = require("passport");
const jwtStrategy = require('./strategy/jwt');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/searchuser", function (req, res, next) {
	console.log("this is query : " + req.query.id)
	var array = [];

	//Get data user yang termasuk friend atau tidak
	M_user
		.find({ _id: req.query.id }, 'friends', function (err, results) {
			if (err) console.log(err)
			//console.log(results[0].friends)
			user2 = results[0].friends
		})

	//Get data dari tabel friend yang melakukan request atau tidak
	M_friend
		.find({ $or: [{ requester: req.query.id }, { recipient: req.query.id }] }
			, function (err, results) {
				if (err) console.log(err)
				results.map(user => {
					console.log(user.requester)
					console.log(user.recipient)
					if (user.requester != req.query.id) {
						array.push(user.requester)
					}
					else {
						array.push(user.recipient)
					}
					//console.log(array)
				})


			})

	//Search user berdasarkan email dari user dan tidak termasuk dari id yang melakukan search
	M_user
		.find({ email: { $regex: req.query.email }, _id: { $ne: req.query.id } }, 'name email')
		.lean()
		.exec(function (err, users) {

			users = users.map(user => {

				//console.log(user2.toString().includes(user._id))
				console.log(user.name + array.toString().includes(user._id))
				if (user2.toString().includes(user._id)) {
					user.isFriend = true
				}
				else {
					user.isFriend = false
				}
				if (array.toString().includes(user._id)) {
					user.isRequest = true
				}
				else {
					user.isRequest = false
				}
				return user
			})
			//console.log(users)
			res.json(users)
		})

});

// Digunakan saat melakukan add friend dengan req.body id requester , id recipient 
router.post("/addfriend", function (req, res, next) {
	console.log("this is requester : " + req.body.requester);
	console.log("this is recipient : " + req.body.recipient);
	M_friend
		.find({
			$or: [
				{ $and: [{ requester: req.body.requester }, { recipient: req.body.recipient }] },
				{ $and: [{ requester: req.body.recipient }, { recipient: req.body.requester }] }
			]
		}, function (err, results) {
			if (err) {
				console.log(err)
			}
			if (!results.length) {
				console.log("notfound")
				// res.json({status:"notfound"})
				M_friend.create(req.body).then(function () {
					console.log("added")
				}).catch(next);
				res.json({ status: "created" })
			}
			else {
				console.log(results)
				res.json({ status: "not found" })
			}
		})
});

router.delete("/deletefriend", function (req, res, next) {
	console.log("id friend : " + req.query.idfriend)
	console.log("id user : " + req.query.iduser)
	M_user
		.findByIdAndUpdate({ _id: req.query.iduser },
			{ $pull: { friends: req.query.idfriend } }
		).then(function (user) {
			console.log("delete friend")
			M_user.findByIdAndUpdate({ _id: req.query.idfriend },
				{ $pull: { friends: req.query.iduser } })
				.then(function (result) {
					console.log("user deleted from friend")
				}).catch(next)
			res.json("status deleted")
		})
})

//Digunakan untuk Get data semua friend list
router.get("/allfriend", function (req, res) {
	M_user
		.find({ _id: req.query.id }, '-password')
		.populate('friends', '-password')
		.exec(function (err, user) {
			res.json(user)
		})
})

//Digunakan untuk mendapatkan data semua request friend
router.get("/datafriendrequest", function (req, res, next) {
	M_friend
		.find({ recipient: req.query.id })
		.populate('requester')
		.exec(function (err, user) {
			if (err) return console.log(err);
			res.json(user)
		})
});

//Digunakan pada action yang dilakukan antara accept atau reject
router.put("/actionrequest", function (req, res, next) {
	console.log(req.body.status);
	console.log(req.body.idrecipient);
	console.log(req.body.idrequester);
	console.log("id document : " + req.body.iddoc);
	if (req.body.status == 1) {
		M_user.findByIdAndUpdate({ _id: req.body.idrecipient },
			{ $addToSet: { friends: req.body.idrequester } })
			.then(function (user) {
				console.log("update user 1")
				M_user.findByIdAndUpdate({ _id: req.body.idrequester },
					{ $addToSet: { friends: req.body.idrecipient } })
					.then(function (result) {
						console.log("user2 updated")
					}).catch(next)

			}).catch(next)
		M_friend
			.findByIdAndDelete({ _id: req.body.iddoc })
			.then(function () {
				res.json({ status: "Accepted" })
			}).catch(next)
	}
	else {
		M_friend
			.findByIdAndDelete({ _id: req.body.iddoc })
			.then(function () {
				res.json({ status: "Rejected" })
			}).catch(next)
	}
})

router.post("/addproject", function (req, res, next) {
	M_project.create(req.body).then(function () {
		res.json({ project: "success" })
	}).catch(next);
});

router.get("/getproject", function (req, res) {
	M_project
		.find({ owner: req.query.id })
		.populate('owner')
		.exec(function (err, project) {
			res.json(project)
		})
})

router.get("/getsharedproject", function (req, res) {
	var array = [];
	M_project
		.find({})
		.populate("owner", 'name')
		.lean()
		.exec(function (err, projects) {

			projects = projects.map(project => {

				if (project.shared.toString().includes(req.query.id)) {
					//console.log(project.shared)
					//console.log(project.name)
					array.push(project)
				}
				else {

					//console.log(project.shared)
				}


			})

			// 	console.log(array)
			// console.log(req.query.id)
			res.json(array)
		})
})

//Digunakan untuk Get data semua friend list
router.get("/friendproject", function (req, res) {

	var array = [];

	M_project
		.findById({ _id: req.query.project }, 'shared', function (err, results) {
			if (err) console.log(err)
			array = results.shared
		})

	M_user
		.find({ _id: req.query.id }, '-password')
		.populate('friends', '-password')
		.lean()
		.exec(function (err, users) {
			users.map(user => {

				friends = user.friends.map(friend => {
					//console.log(friend.name +" and id : "+friend._id)
					//console.log(array.toString().includes(friend._id))
					if (array.toString().includes(friend._id)) {
						friend.isShared = true
					}
					else {
						friend.isShared = false
					}

					//console.log("check is Shared " + friend)
					//console.log('')
					return friend
				})
				res.json(friends)
				//console.log(array)
			})

		})
})

router.put("/inviteproject", function (req, res, next) {
	// console.log(req.body.id)
	// console.log(req.body.project)
	M_project
		.findByIdAndUpdate({ _id: req.body.project },
			{ $addToSet: { shared: req.body.id } })
		.then(function (user) {
			res.json({ getdata: "success" })
		})

});

router.delete("/deleteproject", function (req, res, next) {
	console.log("id project : " + req.query.id)
	M_project
		.findByIdAndDelete({ _id: req.query.id })
		.then(function (user) {
			res.json({ status: "deleted" })
		}).catch(next)
})

router.get("/usershared", function (req, res) {
	M_project
		.find({ _id: req.query.project }, 'shared')
		.populate('shared', 'email')
		.lean()
		.exec(function (err, users) {
			res.json(users)
		})
})

router.delete("/removeshared", function (req, res, next) {
	console.log(req.query.id)
	console.log(req.query.project)

	M_project
		.findByIdAndUpdate({ _id: req.query.project },
			{ $pull: { shared: req.query.id } }
		).then(function (user) {
			res.json({ status: "removed" })
		})
});

router.delete("/deleteshared", function (req, res, next) {
	console.log(req.query.id)
	console.log(req.query.project)
	M_project
		.findByIdAndUpdate({ _id: req.query.project },
			{ $pull: { shared: req.query.id } }
		).then(function (user) {
			res.json({ status: "removed" })
		})
});


router.get("/getxml", function (req, res) {

	//console.log("got the id " + req.query.id)

	M_project
		.findOne({ _id: req.query.id }, 'dataxml')
		.exec(function (err, project) {
			// console.log(project)
			res.json(project)
		})
})

router.put("/savediagram", function (req, res, next) {

	M_project
		.findOneAndUpdate({ _id: req.body.id }, { dataxml: req.body.dataxml, lastEdited: Date.now() })
		.then(function (project) {
			res.json({ "saving": "success" })
		})

	console.log(req.body.dataxml)
	console.log(req.body.id)
	console.log("savediagram click")

});

router.get("/getdataproject", function(req, res, next){
	M_project
	.findOne({ _id: req.query.id}, "owner shared name")
	.then(function(project){
		//console.log("get projecct" + project)
		res.json(project)
	})
})

router.put("/editprojectname", function( req, res, next){
	console.log(req.body.name)
	console.log(req.body.id)
	M_project
	.findOneAndUpdate({_id: req.body.id}, {name: req.body.name, lastEdited:Date.now()})
	.then(function (project){
		res.json({"update" : "success"})
	})
})






//get a list from the db
router.get("/user", passport.authenticate('jwt', { session: false }), function (req, res, next) {
	M_user.find({}).then(function (user) {
		// res.send(user);
		res.json(user);
	});
});

router.get('/homepage', function (req, res, next) {
	if (!req.session.user) {
		return res.status(401).send();
	}
	return res.status(200).send("Welcome to homepage");
});

router.get('/logoutuser', function (req, res, next) {
	req.session.destroy();
	return res.status(200).send();
});

router.post("/loginuser", function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	M_user.findOne({ email: email }, function (err, user) {
		if (err) {
			return res.status(500).send("error");
		}

		if (!user) {
			return res.status(404).send();
		}

		user.comparePassword(password, function (err, isMatch) {
			if (isMatch && isMatch == true) {
				const token = jwt.sign({
					email: user.Email
				},
					config.secret,
					{
						expiresIn: "6h"
					});
				return res.json({
					user_id: user._id,
					user_email: user.email,
					user_name: user.name,
					token: token
				});
			}
			else {
				// console.log("failed");
				return res.status(401).json({
					message: "Auth Failed"
				});
			}
		});
	});
});



router.post("/registeruser", function (req, res, next) {
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;

	var registerUser = new M_user();
	registerUser.email = email;
	registerUser.name = name;
	registerUser.password = password;
	M_user.findOne({
		email: req.body.email
	}, function (err, user) {
		if (user == null) {
			M_user.create(req.body).then(function () {
				res.json({ message: "register done" })
			}).catch(next);
		}
		else {
			res.json({ register: false });
		}
	}
	);
});

//add data
// router.post("/user",function(req, res, next){
//
// 	M_user.findOne({
// 		email: req.body.email
// 	}, function(err, existingUser){
// 		if (existingUser == null) {
// 			M_user.create(req.body).then(function(){
// 			res.sendFile(path.join(__dirname + '/../public/index.html'));
// 			}).catch(next);
// 		}
// 		else{
// 			res.json('Already Exist');
// 		}
// 	}
// 	);
// });

//Update data user : Ganti name
router.put("/user/updateuser/:id", function (req, res, next) {
	M_user.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
		M_user.findOne({ _id: req.params.id }).then(function (user) {
			res.send(user);
		});

	});
});

//Update data user : Ganti password
router.put("/user/updatepassword/:id", function (req, res, next) {
	M_user.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
		M_user.findOne({ _id: req.params.id }).then(function (user) {
			res.send(user);
		});

	});
});



//Delete data user
router.delete("/user/:id", function (req, res, next) {
	M_user.findByIdAndRemove({ _id: req.params.id }).then(function (user) {
		res.send(user);
	});
});

module.exports = router;
