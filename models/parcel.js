const mongoose = require('mongoose');
const parcelSchema = mongoose.Schema({
    _id: {type:mongoose.Schema.Types.ObjectId,auto:true},
    sender:{type:String,required:true},
    address:{type:String,required:true},
    weight:{type:Number,required:true},
    isFragile:{type:String,required:true}
});

module.exports = mongoose.model('Parcel',parcelSchema);