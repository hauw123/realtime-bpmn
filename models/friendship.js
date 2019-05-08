const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
  requester:{
		type: Schema.Types.ObjectId, ref: 'user'
	},
  recipient:{
		type: Schema.Types.ObjectId, ref: 'user'
	},
  status:{
		type: Number,
    default: 1
	}
});

//friendrequest jika status 1 = requested , 2 accepted , 3 rejected
const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
