const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  dateCreated:{
    type: Date,
    default: Date.now
  },
  lastEdited:{
    type:Date,
    default: Date.now
  },
  owner:{
    type: Schema.Types.ObjectId, ref: 'user'
  },
	shared:[{
		type: Schema.Types.ObjectId, ref: 'user'
		
  }],
  dataxml:{
    type: String,
    required: true
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
