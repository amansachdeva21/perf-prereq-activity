// app/routes.js

// grab the nerd model we just created
var prereqdata = require('./models/Nerd');

var assert = require('assert');
//var url = 'mongodb://localhost:27017/perf-db';
var url = 'mongodb://heroku_mvccnplq:5k40iegd6s438j31g42kmav2bs@ds139438.mlab.com:39438/heroku_mvccnplq';
var MongoClient = require('mongodb').MongoClient;

module.exports = function(app) {

    // Find all contacts
    app.get('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        prereqdata.find(function(err, nerds) {

            if (err)
                res.send(err);

            nerds = JSON.stringify(nerds);
            var output = '{"data" : ' + nerds + '}';
            res.json(output); // return all nerds in JSON format
        });
    });

    // routes will go here
    app.post('/api/insert', function(req, res) {
        var currentdate = new Date();
        var d = currentdate.toLocaleDateString() +" "+ currentdate.toLocaleTimeString();

        var run_number = req.param('release-number');
        var release_name = req.param('release-name');
        var release_owner = req.param('release-owner');
        var stdata = 'restore_point,index_rebuild,stats_gather,node_sync,dep_st,dmap_que,keys_table,update_time';

        var datavalue = req.param('release-stdata--restore_point')+","+req.param('release-stdata--index_rebuild')+","+
            req.param('release-stdata--stats_gather')+","+req.param('release-stdata--node_sync')+","+
            req.param('release-stdata--dep_st')+","+req.param('release-stdata--dmap_que')+","+
            req.param('release-stdata--keys_table')+","+ d;

        res.send(run_number + ' ' + release_name + ' ' + release_owner + ' ' + stdata + ' ' + datavalue);

        var doc = {
            run_number: run_number,
            release_name: release_name,
            release_owner: release_owner,
            stdata: stdata,
            datavalue: datavalue
        }
        console.log(doc)

        MongoClient.connect(url, function(err, db) {
            if (err)
                res.send(err);

            var collection = db.collection('prereqdatas')
            collection.update({ release_name : release_name , run_number : run_number },
                { release_name : release_name , run_number : run_number , release_owner : release_owner ,
                    stdata : stdata , datavalue : datavalue} , { upsert : true },
                function(err, result) {
                    db.close()
            })
        })
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        //res.sendFile('C:/Users/asach2/Downloads/starter-node-angular-master/starter-node-angular-master/public/index.html'); // load our public/index.html file
        res.sendfile("/index.html", {"root": __dirname});
    });

};
