var fs = require('fs');
var request = require('request');
var multiparty = require('multiparty');
var govKey = require('./apiKeys.js');
var Hashids = require("hashids");
var hash = new Hashids('hrPenguins');
var counter = 10000;

module.exports = {

  handleForm: function(req, res, next) {
    var form = new multiparty.Form();
    var newPath;

    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });

    form.parse(req, function(err, fields, files) {
      if (err) {
        res.writeHead(400, {'content-type': 'text/plain'});
        res.end("invalid request: " + err.message);
        return;
      }

      if (!files.picture) {
        req.imgPath = 'server/images/defaultMealImage.png';
        req.fields = fields;
        console.log('There are no pictures!')
        next();
      } else {
        var uniqPath = hash.encode(counter);
        counter++;
        var oldPath = files.picture[0].path.split('.');
        var ext = path[path.length - 1];
        req.imgPath = 'server/images/'+ uniqPath + '.' + ext;
        req.fields = fields;
        fs.rename(files.picture[0].path, req.imgPath, function (err) {
          if (err) { next(err); }
          next();
        });
      }
    });
  },

  getImage: function(req, res, next) {
    
    var fileName = req.params.id; // jsfioawe.png
    var options = {
      root: __dirname + './../images/',
      headers: {
        'Content-Type' : 'image/jpeg'
      }
    }
    res.sendFile(fileName, options, function(err) {
      if (err) {
        res.status(err.status).end();
      }
    })
  }
};
