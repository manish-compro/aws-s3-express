'use strict';

const router = require('express').Router();
const awsController = require('../controller/awsController')
const AWS = require('aws-sdk')
var path = require('path');
var fs = require('fs');

router.post('/credential', (req, res)=>{

    var config = new AWS.Config({
        accessKeyId: req.headers.accesskeyid, secretAccessKey: req.headers.secretaccesskey, region: 'us-west-2'
      });

     AWS.config.credentials = config.credentials; 

    AWS.config.getCredentials(function(err) {
        if (err) {console.log(err.stack)
        res.status(500).send('Error in getting credential');}
        
        else {
          console.log("Access key:", AWS.config.credentials.accessKeyId);
          console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
          res.status(200).send('Credentials are now set.');
        }
      });
      
});

router.get('/credential',(req,res)=>{
    try {
        var json = {
            'accessKeyId' : AWS.config.credentials.accessKeyId,
            'secretAccessKey' : AWS.config.credentials.secretAccessKey
        }
        res.status(200).send(json);
        
    } catch (error) {
        var json ={
            'error' : error
        }
        res.status(400).send(json);
    }
   

    
})

router.get('/listBuckets', (req, res)=>{

var s3 = new AWS.S3({apiVersion: '2006-03-01'});

s3.listBuckets(function(err, data) {
  if (err) 
    res.status(400).send(("Error", err));
   else {
    res.status(200).send("Success", data.Buckets);
   
  }
});


}), 


router.post('/createBucket', (req, res)=>{

    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var bucketParams = {
        Bucket : req.headers.bucketname,
        ACL : req.headers.cannedacl
      };
      
     
      s3.createBucket(bucketParams, function(err, data) {
        if (err) {
          res.send("Error", err);
        } else {
          res.status(200).send("Success", data.Location);
        
        }
    })
});

router.post('/uploadFile', (req, res)=>{

var s3 = new AWS.S3({apiVersion: '2006-03-01'});


var uploadParams = {Bucket: req.headers.bucketname, Key: req.headers.key, Body: req.headers.body};
var file = req.headers.filename;



var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  res.send('File Error', err);
});
uploadParams.Body = fileStream;

uploadParams.Key = path.basename(file);

s3.upload (uploadParams, function (err, data) {
  if (err) {
    res.send("Error", err);
  } if (data) {
    res.status(200).send("Upload Success", data.Location);
  }
});

})

router.post('/deleteBucket', (req, res)=>{

  s3 = new AWS.S3();

  var params = {
    Bucket: req.headers.bucketname
  };

  s3.deleteBucket(params, function(err, data) {
    if (err) {
      res.send("Error", err);
    } else {
      res.send("Success", data);
    }
  });
}
)

module.exports = router;