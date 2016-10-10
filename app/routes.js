// Dependencies
var mongoose        = require('mongoose');
var Place            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all places in the db
    app.get('/places', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Place.find({});
        query.exec(function(err, places){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all places
                res.json(places);
            }
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new places in the db
    app.post('/places', function(req, res){

        // Creates a new place based on the Mongoose schema and the post body
        var newplace = new Place(req.body);

        // New Place is saved in the db.
        newplace.save(function(err){
            if(err)
                res.send(err);
            else
                // If no errors are found, it responds with a JSON of the new place
                res.json(req.body);
        });
    });

    // Retrieves JSON records for all places who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat         = req.body.latitude;
        var long        = req.body.longitude;
        var distance    = req.body.distance;
        var minRating   = req.body.minRating;
        var maxRating   = req.body.maxRating;
        var description = req.body.description;
        var reqVerified = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Place.find({});

        // ...include filter by Max Distance 
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance, spherical: true});

        }

        // ...include filter by Min rating
        if(minRating){
            query = query.where('rating').gte(minRating);
        }

        // ...include filter by Max rating
        if(maxRating){
            query = query.where('rating').lte(maxRating);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("true");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, places){
            if(err)
                res.send(err);
            else
                // If no errors, respond with a JSON of all places that meet the criteria
                res.json(places);
        });
    });

    // DELETE Routes (Dev Only)
    // --------------------------------------------------------
    // Delete a place off the Map based on objID
    app.delete('/places/:objID', function(req, res){
        var objID = req.params.objID;
        var update = req.body;

        Place.findByIdAndRemove(objID, update, function(err, place){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });
};
