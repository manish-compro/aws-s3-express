"use strict"
const aws = require('aws-sdk')



class awsController{

    setCredential(req, res){
        var accessKeyId = 'AKIAXSI7ODQFACJOMI62';
        var secretAccessKey = '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';
        new AWS.Credentials(accessKeyId, secretAccessKey);

        AWS.config.getCredentials(function(err) {
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
              console.log("Access key:", AWS.config.credentials.accessKeyId);
              console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
            }
          });
          res.send(AWS.config.credentials.accessKeyId);
    }
}


module.exports = awsController;