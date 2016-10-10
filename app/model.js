// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Bottles Schema. This will be the basis of how user data is stored in the db
var BottleSchema = new Schema({
    name: {type: String, required: true},
    rating: {type: Number, required: true},
    description: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
BottleSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
BottleSchema.index({location: '2dsphere'});

// Exports the BottleSchema for use elsewhere. Saves to a Bottles collection
module.exports = mongoose.model('Bottles', BottleSchema);
