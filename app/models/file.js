var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//declare post schema
var FileSchema = new Schema({
	name: String,
	data: String,
	size: Number,
	time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('FileUpload', FileSchema);