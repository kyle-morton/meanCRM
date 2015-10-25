var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//declare post schema
var AvatarSchema = new Schema({
	name: String,
	data: String,
	size: Number,
	extension: String,
	user: String,
	time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Avatar', AvatarSchema);