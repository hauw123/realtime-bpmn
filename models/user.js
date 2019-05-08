const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Project = require('./project.js');
const projectSchema = mongoose.model('Project').schema;
const bcrypt = require('bcrypt'),
			SALT_WORK_FACTOR = 10;

//Create user Schema and model
const userSchema = new Schema({
	email:{
		type: String,
		required: [true,'Email field is required']
	},
	name:{
		type: String
	},
	password:{
		type: String
	},
	created:{
		type:Date,
		default: Date.now
	},
	friends:[{
		type: Schema.Types.ObjectId, ref: 'user'
		
	}],
	status:{
		type: Boolean,
		default: false
	}
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


const User = mongoose.model('user',userSchema);

module.exports = User;



// //create geolocation schema
// const geoSchema = new Schema({
// 	type: {
// 		type: String,
// 		default: "Point"
// 	},
// 	coordinates: {
// 		type: [Number],
// 		index: "2dsphere"
// 	}
// });


// //Create user Schema and model
// const userSchema = new Schema({
// 	name:{
// 		type: String,
// 		required: [true,'Name field is required']
// 	},
// 	rank:{
// 		type: String
// 	},
// 	available:{
// 		type: Boolean,
// 		default: false
// 	},
// 	geometry: geoSchema
// });

// const User = mongoose.model('user',userSchema);

// module.exports = User;
